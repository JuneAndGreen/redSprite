var async = require('async');
var path = require('path');
var fs = require('fs');
var vfs = require('vinyl-fs');
var through2 = require('through2');

var format = require('./format');
var ReadImg = require('./readImg');
var CreateImg = require('./createImg');
var Template = require('./template');

var imgsinfo; // callback时输出的信息
var tplinfo; // 填充模板时输出的信息
var Sprite = function(options) {
	this.filemap = options.filemap;
	this.imgsinfo = imgsinfo = {};
	this.tplinfo = tplinfo = [];

	this.init(options);
};

Sprite.prototype = {
	/*
	 * 处理层级数据
	 */
	init: function(options) {
		if(!format.checkFilemap(this.filemap)) {
			throw new Error('filemap参数结构不合法');
		}
		if(!format.checkInputSrc(this.filemap)) {
			throw new Error('输入文件存在无效路径');
		}
		if(!format.checkOutputDir(this.filemap)) {
			throw new Error('生成sprite图的文件路径不正确');
		}
		this.filelist = format.getOutputList(options.filemap);
		this.readimg = new ReadImg({
			orientation: format.getOrientation(options.orientation),
			sort: options.sort,
			margin: options.margin
		});
		this.createimg = new CreateImg();
		this.template = new Template({
			template: options.template,
			infosrc: options.infosrc
		})

	},
	/*
	 * 整合输出信息
	 */
	merge: function(layerInfo, enc, callback) {
		var inputmap = imgsinfo[layerInfo.filePath] = {};
		var pathObj = path.parse(layerInfo.filePath);
		var tplobj = {
			path: layerInfo.filePath, // 大图路径
			name: path.basename(layerInfo.filePath, pathObj.ext), // 大图名称
			ext: pathObj.ext.substr(1), // 大图后缀
			width: layerInfo.width,
			height: layerInfo.width,
			items: []
		};

		layerInfo.items.forEach(function(item) {
			var pathitemObj = path.parse(item.meta.name);
			var obj = {
				path: item.meta.name, // 小图路径
				name: path.basename(item, pathitemObj.ext), // 小图名称
				ext: pathitemObj.ext.substr(1), // 小图后缀
				width: item.width,
				height: item.height,
				x: item.x,
				y: item.y
			};
			inputmap[item.meta.name] = obj;
			tplobj.items.push(obj);
		});

		tplinfo.push(tplobj);
		callback(null);
	},
	/*
	 * 执行sprite图生成
	 */
	sprite: function(callback) {
		// 逐个文件合并
		async.eachSeries(this.filelist, function(file, eachCb) {
			var filemap = this.filemap;
			var inputlist = filemap[file];
			//获取输出路径信息
			var pathObj = path.parse(file);
			this.createimg.setInfo({
				path: file,
				format: pathObj.ext.substr(1) || 'png'
			});
			vfs.src(inputlist)
				 .pipe(through2.obj(this.readimg.read, this.readimg.afterRead))
				 .pipe(through2.obj(this.createimg.create, this.createimg.afterCreate))
				 .pipe(through2.obj(this.merge))
				 .on('data', function() {})
				 .on('end', function() {
				 		eachCb(null);
				 });
		}.bind(this), function(err) {
			if(err) throw new Error(err);
			this.template.generate(tplinfo, function(err) {
				if(err) throw new Error('生成信息文件失败') 
				callback(this.imgsinfo);
			});
		}.bind(this));
	}
};

module.exports = Sprite;
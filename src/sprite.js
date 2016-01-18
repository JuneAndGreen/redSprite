var async = require('async');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var layout = require('layout');
var lwip = require('lwip');
var vfs = require('vinyl-fs');
var through2 = require('through2');

var format = require('./format');

var Sprite = function(options) {
	this.opt = options;
	this.filemap = options.filemap;
	this.margin = options.margin;

	this.filelist = format.getOutputList(options.filemap);
	this.orientation = format.getOrientation(options.orientation);

	this.init(options);
};

Sprite.prototype = {
	/*
	 * 处理层级数据
	 */
	init: function(options) {
		if(!format.checkInputSrc(this.filemap)) {
			throw new Error('输入文件存在无效路径');
		}
		if(!format.checkOutputDir(this.filelist)) {
			throw new Error('生成sprite图的文件路径不正确');
		}
		this.layer = layout(this.orientation, {sort: options.sort});
	},
	/*
	 * 整合输出信息
	 */
	merge: function(data) {
		var res = {};
		_.forOwn(data, function(value, key) {
			var map = res[key] = {};
			value.forEach(function(item) {
				map[item.meta.name] = {
					width: item.width,
					height: item.height,
					x: item.x,
					y: item.y
				}
			});
		});
		return res;
	},
	/*
	 * 读取图片
	 */
	readImg: function(srcArr, callback) {
		var res = [];
		async.eachSeries(srcArr, function(src, eachCb) {
			// 读取图像
			lwip.open(src, function(err, img) {
				if(err) {
					eachCb(err);
				}
				res.push({
		      height: img.height() + 2 * this.margin,
		      width: img.width() + 2 * this.margin,
		      meta: {
		        name: src,
		        img: img,
		        margin: this.margin
		      }
		    });
				eachCb(null);
			}.bind(this));
		}.bind(this), function(err) {
			if(err) throw new Error('读取图片文件失败');
			callback(res);
		}.bind(this))
	},
	/*
	 * 生成图像
	 */
	createImg: function(layerInfo, callback) {
		lwip.create(layerInfo.width, layerInfo.height, function(err, img) {
			if(err) throw new Error('创建图片文件失败');
      async.eachSeries(layerInfo.items, function(item, eachCb) {
        img.paste(item.x+item.meta.margin, item.y+item.meta.margin, item.meta.img, eachCb);
      }, function(err) {
      	if(err) throw new Error('创建图片文件失败');
        callback(img);
      });
    });
	},
	/*
	 * 执行sprite图生成
	 */
	sprite: function(callback) {
		var resMap = {};

		// 逐个文件合并
		async.eachSeries(this.filelist, function(file, eachCb) {
			var filemap = this.filemap;
			var inputlist = filemap[file];
			//获取输出路径信息
			var pathObj = path.parse(file);
			
			var layerInfo;
			async.waterfall([function(cb) {
				// 读取图片
				this.readImg(inputlist, function(res) {
					res.forEach(function(item) {this.layer.addItem(item)}, this);
					cb(null);
				}.bind(this));
			}.bind(this), function(cb) {
				// 生成图片
				layerInfo = this.layer.export();
				if(!layerInfo.items.length) {
					cb(null, null);
					return;
				}
				this.createImg(layerInfo, function(img) {
					cb(null, img)
				});
			}.bind(this), function(img, cb) {
				// 生成图片的信息整合
				if(!img) {
					cb(null, null);
					return;
				}
				cb(null, {
					image: img,
					path: file,
					format: pathObj.extname || 'png'
				});
			}.bind(this), function(info, cb) {
				// 获取图片的二进制数据
				if(!info) {
					cb(null, null);
					return;
				}
				info.image.toBuffer(info.format, {}, function(err, buffer) {
					if(err) {
						cb(err);
					} else {
						info.buffer = buffer;
						cb(null, info)
					}
				});
			}.bind(this), function(info, cb) {
				// 将二进制数据写进文件中
				if(!info) {
					cb(null, null);
					return;
				}
				fs.writeFile(info.path, info.buffer, cb)
			}], function(err) {
				resMap[file] = layerInfo.items;
				eachCb(err);
			});
		}.bind(this), function(err) {
			if(err) {
				throw new Error(err);
			} else {
				callback(this.merge(resMap));
			}
		}.bind(this));
	}
};

module.exports = Sprite;
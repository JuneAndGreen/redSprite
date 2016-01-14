var async = require('async');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var layout = require('layout');
var lwip = require('lwip');

var Sprite = function(options) {
	this.opt = options;
	this.fileMap = options.filemap;
	this.fileList = [];
	this.margin = options.margin;

	_.forOwn(this.fileMap, function(value, key) {
		this.fileList.push(key)
	}.bind(this));

	this.init();
};

Sprite.prototype = {
	/*
	 * 处理层级数据
	 */
	init: function() {
		var options = this.opt;
		switch(options.orientation) {
			case 0:
				// 纵向
				this.orientation = 'top-down';
				break;
			case 1:
				// 横向
				this.orientation = 'left-right';
				break;
			default:
				// 默认
				this.orientation = 'binary-tree';
				break;
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
		async.eachSeries(this.fileList, function(file, eachCb) {
			var fileMap = this.fileMap;
			var inputList = fileMap[file];

			//判断输入路径是否有效
			for(var i=1; i<inputList.length; i++) {
				var itm = inputList[i];
				if(!fs.existsSync(itm)) {
					break;
				}
			}
			if(i < inputList.length) {
				eachCb('输入文件存在无效路径');
				return;
			}

			//获取输出路径信息
			var pathObj = path.parse(file);
			if(!pathObj || !fs.existsSync(pathObj.dir)) {
				// 输出路径目录不存在
				eachCb('生成sprite图的文件路径不正确');
				return;
			}
			
			var layerInfo;
			async.waterfall([function(cb) {
				// 读取图片
				this.readImg(inputList, function(res) {
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
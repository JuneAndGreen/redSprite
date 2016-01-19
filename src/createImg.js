var lwip = require('lwip');
var async = require('async');
var fs = require('fs');

var layerInfo;
var imageInfo;
var image;
var CreateImg = function() {};

CreateImg.prototype = {
	/*
	 * 初始化数据
	 */
	init: function() {},
	/*
	 * 创建图片
	 */
	create: function(data, enc, callback) {
		if(!data.items.length) callback(null);
		lwip.create(data.width, data.height, function(err, img) {
			if(err) throw new Error('创建图片文件失败');

      async.eachSeries(data.items, function(item, eachCb) {
      	// 逐个图片粘帖
        img.paste(item.x+item.meta.margin, item.y+item.meta.margin, item.meta.img, eachCb);
      }, function(err) {
      	if(err) throw new Error('创建图片文件失败');

      	layerInfo = data;
      	image = img;
        callback(null);
      });
    });
	},
	/*
	 * 创建完图片后的处理
	 */
	afterCreate: function(callback) {
		layerInfo.filePath = imageInfo.path;
		this.push(layerInfo);
		image.toBuffer(imageInfo.format, {}, function(err, buffer) {
			if(err) throw new Error('创建图片文件失败');

			// 将二进制数据写进文件中
			fs.writeFile(imageInfo.path, buffer, function(err) {
				if(err) throw new Error('创建图片文件失败');

				callback(null); 
			})
		});
	},
	/*
	 * 设置相关图片信息
	 */
	setInfo: function(info) {
		imageInfo = info;
	}
}

module.exports = CreateImg;
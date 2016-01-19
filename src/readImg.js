var lwip = require('lwip');
var layout = require('layout');

var layer;
var margin;
var ReadImg = function(options) {
	this.layer = layout(options.orientation, {sort: options.sort});
	this.margin = options.margin;

	this.init();
};

ReadImg.prototype = {
	/*
	 * 初始化数据
	 */
	init: function() {
		layer = this.layer;
		margin = this.margin;
	},
	/*
	 * 读取图片
	 */
	read: function(file, enc, callback) {
		var src = file.path;
		lwip.open(src, function(err, img) {
			if(err) throw new Error('读取图片文件失败');
			
			// 获取各个图片的信息
			layer.addItem({
	      height: img.height() + 2 * margin,
	      width: img.width() + 2 * margin,
	      meta: {
	        name: src,
	        img: img,
	        margin: margin
	      }
	    });
	    callback(null);
	  });
	},
	/*
	 * 读取完所有图片后的批处理
	 */
	afterRead: function(callback) {
		this.push(layer.export());
		callback(null);
	}
};

module.exports = ReadImg;
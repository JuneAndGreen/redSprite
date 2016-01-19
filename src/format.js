var _ = require('lodash');
var path = require('path');
var fs = require('fs');

format = {
	/*
	 * 获取输出文件名列表
	 */
	getOutputList: function(filemap) {
		return Object.keys(filemap);
	},
	/*
	 * 获取图片排列方式
	 */
	getOrientation: function(orientation) {
		switch(orientation) {
			case 0:
				// 纵向
				return 'top-down';
				break;
			case 1:
				// 横向
				return 'left-right';
				break;
			default:
				// 默认
				return 'binary-tree';
				break;
		}
	},
	/*
	 * 判断filemap结构是否合法
	 */
	checkFilemap: function(filemap) {
		if(!_.isObject(filemap)) return false;
		var filelist = Object.keys(filemap);
		for(var i=0; i<filelist.length; i++) {
			var inputlist = filemap[filelist[i]];
			if(!_.isArray(inputlist)) return false;
		}
		return true;
	},
	/*
	 * 判断输入路径是否存在
	 */
	checkInputSrc: function(filemap) {
		var filelist = Object.keys(filemap);
		for(var i=0; i<filelist.length; i++) {
			var inputlist = filemap[filelist[i]];
			for(var j=0; j<inputlist.length; j++) {
				if(!fs.existsSync(inputlist[j])) return false;
			}
		}
		return true;
	},
	/*
	 * 判断输出路径是否合法目录
	 */
	checkOutputDir: function(filemap) {
		var filelist = Object.keys(filemap);
		for(var i=0; i<filelist.length; i++) {
			var dir = path.dirname(filelist[i]);
			if(!dir || !fs.existsSync(dir)) return false;
		}
		return true;
	}
};

module.exports = format;
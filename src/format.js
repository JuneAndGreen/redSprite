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
	 * 判断输入路径是否存在
	 */
	checkInputSrc: function(filemap) {
		var filelist = Object.keys(filemap);
		for(var i=0; i<filelist.length; i++) {
			var inputlist = filelist[i];
			for(var j=0; j<inputlist.length; i++) {
				if(!fs.existsSync(inputlist[j])) return false;
			}
		}
		return true;
	},
	/*
	 * 判断输出路径是否合法目录
	 */
	checkOutputDir: function(filelist) {
		for(var i=0; i<filelist.length; i++) {
			var pathObj = path.parse(filelist[i]);
			if(!pathObj || !fs.existsSync(pathObj.dir)) return false;
		}
		return true;
	}
};

module.exports = format;
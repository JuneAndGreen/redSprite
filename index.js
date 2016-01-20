var _ = require('lodash');
var Sprite = require('./src/sprite');

var def = {
	/* 文件映射表 */
	filemap: {},
	/* 间距 */
	margin: 0,
	/* 排列方向，0表示竖向，1表示横向 */
	orientation: 0,
	/* 是否排序 */
	sort: true,
	/* 输出信息模板，可直接传入或使用绝对路径，必须使用utf-8编码 */
	template: null,
	/* 输出信息路径 */
	infosrc: null
};
var blank = function() {};

module.exports = {
	/*
	 * 合并精灵图
	 */
	create: function(options, callback) {
		if(!options || !options.filemap) {
			throw new Error('缺少相关配置信息');
		}
		if(!callback || !_.isFunction(callback)) {
			callback = blank;
		}

		options = _.assignIn({}, def, options);
		new Sprite(options).sprite(callback);
	}
};
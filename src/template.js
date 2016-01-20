var path = require('path');
var fs = require('fs');
var parse = require('./parse');

var Template = function(options) {
	this.template = options.template;
	this.infosrc = options.infosrc;

	this.init(options);
};

Template.prototype = {
	/*
	 * 初始化数据
	 */
	init: function(options) {
		this.cantpl = this.validate();
	},
	/*
	 * 检查数据正确性
	 */
	validate: function() {
		if(!this.template || !this.infosrc) return false;
		// 判断输出信息文件路径目录是否存在
		var dir = path.dirname(this.infosrc);
		if(!dir || !fs.existsSync(dir)) return false;
		// 判断模板为路径情况是否能否读取
		if(fs.existsSync(this.template)) {
			try {
				this.template = fs.readFileSync(this.template, 'utf-8');
			} catch(ex) {
				return false;
			}
		}

		return true;
	},
	/*
	 * 解析模板
	 */
	parse: function(data) {
		if(!this.cantpl) return;

		return parse(this.template, {data: data});
	},
	/*
	 * 写信息文件
	 */
	writeFile: function(str, callback) {
		if(!this.cantpl) return;

		fs.writeFile(this.infosrc, str, callback);
	},
	/*
	 * 生成信息文件
	 */
	generate: function(tplinfo, callback) {
		if(!this.cantpl) {
			callback(null);
			return;
		}

		var out = this.parse(tplinfo);
		if(~out) {
			this.writeFile(out, callback);
			return;
		}

		callback('生成信息文件失败');
	}
};

module.exports = Template;
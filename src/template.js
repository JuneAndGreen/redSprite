var path = require('path');
var fs = require('fs');


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
		if(!dir || fs.existsSync(dir)) return false;
		// 判断模板为路径情况是否能否读取
		if(fs.existsSync(this.template)) {
			try {
				this.template = fs.readFileSync(this.template);
			} catch(ex) {
				return false;
			}
		}

		return true;
	},
	/*
	 * 解析模板
	 */
	parse: function() {
		if(!this.cantpl) return;

		
	}
};

module.exports = Template;
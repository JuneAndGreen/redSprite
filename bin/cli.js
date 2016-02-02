#!/usr/bin/env node

var redSprite = require('../index');
var packageJson = require('../package.json');

var program = require('commander');

var defpath = __dirname;
var defTplpath = path.join(__dirname, '../tpl.css');
var defMargin = 0;
 
program
  .version(packageJson.version)
  .option('-i, --input [dir_path]', '输入图片目录，默认为当前目录')
  .option('-o, --out [dir_path]', '输出图片目录，默认为当前目录')
  .option('-t, --template [file_path]', '输出信息模板路径')
  .option('-m, --margin [number]', '图片之间的间距，默认为0', 'wtf')
  .parse(process.argv);

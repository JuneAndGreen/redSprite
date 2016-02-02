# redSprite

## 简介

主要做精灵图自动合并，并返回合并后的信息，目前支持的功能较少，仅支持主要的合并配置

## 安装

```bash
npm install --save redsprite
```

## 使用

```javascript
var redSprite = require('redsprite');

redSprite.create({
	filemap: {
		'outputfilepath0': ['inputfilepath0', 'inputfilepath1'],
		'outputfilepath1': ['inputfilepath2', 'inputfilepath3']
	},
	margin: 10,
	sort: true,
	orientation: 0, // 0 - 纵向排列，1 - 横向排列
	tempate: './tpl.css', // 生成的雪碧图信息文件模板，要求为utf-8编码
	infosrc: './out/tpl.info.css' // 生成的雪碧图信息文件
}, function(err, res) {
	// res的结构
	// {
	// 	'outputfilepath0': {
	// 		'inputfilepath0': {width:xx, height:xx, x:xx, y:xx}, 
	// 		'inputfilepath1': {width:xx, height:xx, x:xx, y:xx}
	// 	},
	// 	'outputfilepath1': {
	// 		'inputfilepath2': {width:xx, height:xx, x:xx, y:xx}, 
	// 		'inputfilepath3': {width:xx, height:xx, x:xx, y:xx}
	// 	}
	// }
});
```

## 模板语法

使用方法与其他模板引擎类似

### 条件判断

```
{if condition}
	// code
{elseif condition}
	// code
{else}
	// code
{/if}
```

### 循环遍历

```
{list arr as item}
	// item_index --> 下标
	// code
{/list}
```

### 定义变量

```
{var a = 3} // 定义变量a
```

### 插值

注意插值语法里`{`前面有一个`$`符号

```
${a} // 插入变量a的值
```

## 注入数据

注入到模板的变量只有一个data数组，结构如下

```javascript
data: [
	{
		path: 'xxx', // 大图路径
		name: 'xxx', // 大图名称
		ext: 'xxx', // 大图后缀
		width: xxx,
		height: xxx,
		items: [
			{
				path: 'xxx', // 小图路径
				name: 'xxx', // 小图名称
				ext: 'xxx', // 小图后缀
				width: xxx,
				height: xxx,
				x: xxx,
				y: xxx
			}
		]
	}
]
```

## 协议

MIT
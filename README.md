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
	orientation: 0 // 0 - 纵向排列，1 - 横向排列
}, function(res) {
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

## 协议

MIT
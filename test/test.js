var sprite = require('./../index');
var path = require('path');

var obj = {
	filemap: {},
	margin: 0,
	orientation: 0,
	template: null,
	infofile: null,
	sort: true
};
obj.filemap[path.join(__dirname, './output/out.png')] = [
	path.join(__dirname, './input/0.png'),
	path.join(__dirname, './input/1.png'),
	path.join(__dirname, './input/2.png'),
	path.join(__dirname, './input/3.png')
];

sprite.create(obj, function(res) {
	console.log(JSON.stringify(res, null, '\t'));
});
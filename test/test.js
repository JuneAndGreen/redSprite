var sprite = require('./../index');
var path = require('path');
var path = require('path');
var should = require('should');

describe('sprite the images',function(){
  it('should return the result iamge info',function(){
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

		var shouldRes = {};
		var map = shouldRes[path.join(__dirname, './output/out.png')] = {};
		map[path.join(__dirname, './input/0.png')] = {width:64,height:64,x:0,y:0};
		map[path.join(__dirname, './input/1.png')] = {width:64,height:64,x:0,y:64};
		map[path.join(__dirname, './input/2.png')] = {width:64,height:64,x:0,y:128};
		map[path.join(__dirname, './input/3.png')] = {width:64,height:64,x:0,y:192};

		sprite.create(obj, function(res) {
			res.should.equal(map);
		});
	});
});
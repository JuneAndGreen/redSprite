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
			sort: true
		};
		obj.filemap[path.join(__dirname, './output/out.png')] = [
			path.join(__dirname, './input/0.png'),
			path.join(__dirname, './input/1.png'),
			path.join(__dirname, './input/2.png'),
			path.join(__dirname, './input/3.png')
		];
		
		sprite.create(obj, function(res) {
			res.should.type('object');
		});
	});
});
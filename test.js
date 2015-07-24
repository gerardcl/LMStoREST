var expect = require('chai').expect;
var hippie = require('hippie');

console.log("NOTE: Remember running the app before executing tests over it (i.e.: npm start)")

function api() {
  return hippie()
    .json()
	.base('http://localhost:8080/api')
}

describe('Basic LMS API REST connectivity test', function(){

it ('- GET to root URI',function(done){
	api()
		.get('/')
		.expectStatus(200)
		.expectBody('{"message":"Hi! welcome to LMS API REST!"}')
		.end(function(err, res, body) {
			if (err) throw err;
			done();
		});
});

//  it(function(done){
//  ...
//  });

});
//describe('LMS API REST to LMS TCP socket connectivity test', function(){

 // it(function(done){
 // ...
 // });

//});
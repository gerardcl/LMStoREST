var expect = require('chai').expect;
var hippie = require('hippie');

console.log("NOTE: Remember running whole platform before executing tests over it \n - run \'livemediastreamer <port>\' \n - run \'npm start\'");

function api() {
  return hippie()
    .json()
	.base('http://localhost:8080/api')
}

describe('LMS API REST tests', function(){

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

	it ('- GET state',function(done){
		api()
			.get('/state')
			.expectStatus(200)
			.end(function(err, res, body) {
				if (err) throw err;
				done();
			});
	});

	it ('- POST new filter',function(done){
		api()
			.post('/create?entity=filter&id=1000&type=receiver&role=master')
			.expectStatus(200)
			.expectBody('{"message":"New receiver filter created with id 1000"}')
			.end(function(err, res, body) {
				if (err) throw err;
				done();
			});
	});

	it ('- POST existing filter',function(done){
		api()
			.post('/create?entity=filter&id=1000&type=receiver&role=master')
			.expectStatus(200)
			.expectBody('{"message":"Error registering filter. Specified ID already exists.. Filter was not created"}')
			.end(function(err, res, body) {
				if (err) throw err;
				done();
			});
	});
});

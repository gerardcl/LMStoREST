//
//  test.js - Mocha suite tests specifics for the lms-middleware.js server
//  Copyright (C) 2013  Fundació i2CAT, Internet i Innovació digital a Catalunya
//
//  This file is part of LMStoREST project.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//  Authors:  Gerard Castillo <gerard.castillo@i2cat.net>
// 

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

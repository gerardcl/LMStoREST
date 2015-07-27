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

var request = require('supertest');
var uri = "http://localhost:8080/api";

console.log("NOTE: Remember running whole platform before executing tests over it \n - run \'livemediastreamer <port>\' \n - run \'npm start\'");


describe('LMS API REST tests', function(){
	it ('- POST connect',function(done){
	    var message = { port : 7777, host : '127.0.0.1'};
	    request(uri)
	      .post("/connect")
	      .send(message)
	      .expect(200)
	      .expect({"message":"LMS middleware successfully configured to host 127.0.0.1 and port 7777"}, done);	
	});

	it ('- GET state',function(done){
	    request(uri)
	      .get("/state")
	      .expect(200, done)
	});

	it ('- POST new filter',function(done){
	    var message = { id : 1, type : 'receiver', role: 'master', sharedFrames: true};
	    request(uri)
	      .post("/createFilter")
	      .send(message)
	      .expect(200)
	      .expect({"message":"New receiver filter created with id 1"}, done);	  	
	});

	it ('- POST existing filter',function(done){
	    var message = { id : 1, type : 'receiver', role: 'master', sharedFrames: true};
	    request(uri)
	      .post("/createFilter")
	      .send(message)
	      .expect(200)
	      .expect({"error":"Error registering filter. Specified ID already exists.. Filter was not created"}, done);	  	
	});
});

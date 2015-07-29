//
//  lms-middleware.js - An API REST middleware for the LiveMediaStreamer framework
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

// BASE SETUP
// =============================================================================
// call the packages we need
var express    		= require('express');
var bodyParser 		= require('body-parser');
var app        		= express();
var morgan     	 	= require('morgan');
var lmsInterface 	= require('./app/modules/lms-interface.js');

// configure app
app.use(morgan('dev')); // log requests to the console
var port = process.env.PORT || 8080; // set our port

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// prepare lms Instance TCP socket
var lmsInstance		= null;

// ROUTES FOR LMS API REST
// =============================================================================
// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('New incoming request...');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Hi! welcome to LMS API REST!' });	
});

// ----------------------------------------------------
// API routes for Pipeline management:
// - connect: checks LMS process connectivity (host and port required) and create lmsInstance
// - disconnect: stops LMS process and destroys lmsInstance
// - state: return global pipe state
// - createFilter: creates a filter (id, type and role required)
// - createPath: creates a path ()
// ----------------------------------------------------
router.route('/connect')
	// connect to LMS process and configure LMS instance (accessed at POST http://localhost:8080/api/connect)
	.post(function(req, res) {
		if (req.body.port && req.body.host){
			if(!lmsInstance){
				lmsInstance = new lmsInterface(req.body.host, req.body.port); 
				lmsInstance.getState(function(response){
					if(response.error){
						console.log('Error connecting to LMS host '+lmsInstance._host+' and port ' + lmsInstance._port);
						res.json({error: 'No LiveMediaStreamer running at host '+lmsInstance._host+' and port ' + lmsInstance._port});
						lmsInstance = null;
					} else {
						console.log('LMS middleware connected to LMS host '+lmsInstance._host+' at port ' + lmsInstance._port);
						res.json({message: 'LMS middleware successfully configured to host '+lmsInstance._host+' and port ' + lmsInstance._port});
					}
				});
			} else {
				res.json({error: 'LMS middleware already configured to host '+lmsInstance._host+' and port '+lmsInstance._port});
			}
		} else {
			res.json({error: 'No host and port specified'});
		}
	});

router.route('/disconnect')
	// disconnect from LMS process and destroy LMS instance (accessed at GET http://localhost:8080/api/disconnect)
	.get(function(req, res) {
		if(lmsInstance){
			lmsInstance.disconnect(function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
				} else {
					res.json({message: 'Successfully disconnected from LMS instance ('+lmsInstance._host+':'+lmsInstance._port+')'});
				}	
				lmsInstance = null;
			});
		} else {
			res.json({error: 'Already disconnected from LMS'});
		}
	});

router.route('/state')
	// get lms state (accessed at GET http://localhost:8080/api/state)
	.get(function(req, res) {
		if(lmsInstance){
			lmsInstance.getState(function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
					lmsInstance = null;
				} else {
					res.json(response);
				}	
			});
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	});

router.route('/createFilter')
	// create filter or path entity (accessed at POST http://localhost:8080/create)
	.post(function(req, res) {
		if(lmsInstance){
			lmsInstance.createFilter(req.body, function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
					lmsInstance = null;
				} else {
					res.json(response);
				}							
			});
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	});

router.route('/createPath')
	// create filter or path entity (accessed at POST http://localhost:8080/create)
	.post(function(req, res) {
		if(lmsInstance){
			lmsInstance.createPath(req.body, function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
					lmsInstance = null;
				} else {
					res.json(response);
				}							
			});
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	});
	
//TODO: implement delete filter and path methods


// ----------------------------------------------------
// API routes for Filter's management:
// - getFilterState: returns specified filter state by its id
// - configureFilter: configures any filter by specifying the id and bypassing body params
// ----------------------------------------------------
router.route('/filter/:filter_id')
	// configure a filter type (accessed at POST http://localhost:8080/configure)
	.get(function(req, res) {
		lmsInstance.getFilterState(req.params.filter_id, function(response){
			if(response.error && response.error.code){
				res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
				lmsInstance = null;
			} else {
				res.json(response);
			}	
		});
	})
	// update any filter. Assumes an array of input action objects or a single action object
	// from the APP (then, the filterId param is added per action).
	// the incoming array should be like:
	// [{"action":"action1","delay":30,"params":{"foo":"bar"}},{"action":"action2","params":{"bar":"foo"}},...]
	.put(function(req, res) {
		if(lmsInstance){
			lmsInstance.configureFilter(req.params.filter_id, req.body, function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused ('+response.error.code+'). Check LMS connectivity and connect again.'});
					lmsInstance = null;
				} else {
					res.json(response);
				}							
			});
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	})


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LMS API REST listening on port ' + port);

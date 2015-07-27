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

// configure TCP socket
// TODO to be configured through the API
var socketPort     	= 7777; 		// set our port
var socketHost      = '127.0.0.1'; 	// set our port
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

// on routes that end in /connect
// ----------------------------------------------------
router.route('/connect')
	// connect to LMS process and configure LMS instance (accessed at POST http://localhost:8080/api/connect)
	.post(function(req, res) {
		if (req.query.port && req.query.host){
			if(!lmsInstance){
				lmsInstance = new lmsInterface(req.query.host, req.query.port); 
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

// on routes that end in /state
// ----------------------------------------------------
router.route('/state')
	// get lms state (accessed at GET http://localhost:8080/api/state)
	.get(function(req, res) {
		if(lmsInstance){
			lmsInstance.getState(function(response){
				if(response.error && response.error.code){
					res.json({error: 'Connection refused. Check LMS connectivity and connect again.'});
					lmsInstance = null;
				} else {
					res.json(response);
				}	
			});
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	});

// on routes that end in /create 
// ----------------------------------------------------
router.route('/create')
	// create a filter, path or pipe entity (accessed at POST http://localhost:8080/create)
	.post(function(req, res) {
		if(lmsInstance){
			if(req.query.entity){
				switch (req.query.entity){
					case 'filter':
						//TODO check required input params!
						lmsInstance.createFilter(req.query, function(response){
							if(response.error && response.error.code){
								res.json({error: 'Connection refused. Check LMS connectivity and connect again.'});
								lmsInstance = null;
							} else {
								res.json(response);
							}							
						});
						break;
					case 'path':
						res.json({message: 'to be implemented'});
						break;
					case 'pipe':
						res.json({message: 'to be implemented'});
						break;
					default:
						res.json({message: 'can only create a filter, a path or a pipe!'});
						break;
				}
			} else {
				res.json({message: 'request query must indicate an entity (i.e.: filter, path or pipe)'});
			}
		} else {
			res.json({error: 'Not connected to any LMS instance'});
		}
	})

// on routes that end in /configure 
// ----------------------------------------------------
router.route('/configure')
	// configure a filter type (accessed at POST http://localhost:8080/configure)
	.post(function(req, res) {
		if(req.query.type){
			switch (req.query.type){
				case 'videoEncoder':
					lmsInstance.configureVideoEncoder(req.query, function(response){
						//TODO check response message - if ECONN reply with message like 500 instead of 200
						res.json(response);
					});
					break;
				default:
					res.json({message: 'can only configure a videoEncoder...!'});
					break;
			}
		} else {
			res.json({message: 'request query must indicate a filter type (i.e.: videoEncoder, ...)'});
		}
	})

// on routes that end in /delete 
// ----------------------------------------------------


// on routes that end in /stop 
// ----------------------------------------------------


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LMS API REST listening on port ' + port);

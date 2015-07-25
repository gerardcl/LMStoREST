// BASE SETUP
// =============================================================================
// call the packages we need
var express    		= require('express');
var bodyParser 		= require('body-parser');
var app        		= express();
var morgan     		= require('morgan');
var lmsInterface 	= require('./app/modules/lms-interface.js');

// configure app
app.use(morgan('dev')); // log requests to the console
var port     = process.env.PORT || 8080; // set our port

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure TCP socket
//TODO to be configured through the API
var socketPort     = 7777; // set our port
var socketHost     = '127.0.0.1'; // set our port

// configure DB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lms-middleware');
var Pipe     = require('./app/models/pipe');
var Path     = require('./app/models/path');
var Filter     = require('./app/models/filter');
console.log('Cleaning DB');
Filter.remove(function(err, p){
    if(err){ 
        throw err;
    } else{
        console.log(p+' filters cleaned');
    }
});
Path.remove(function(err, p){
    if(err){ 
        throw err;
    } else{
        console.log(p+' paths cleaned');
    }
});
Pipe.remove(function(err, p){
    if(err){ 
        throw err;
    } else{
        console.log(p+' pipes cleaned');
    }
});

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

// on routes that end in /state
// ----------------------------------------------------
router.route('/state')
	// get lms state (accessed at GET http://localhost:8080/api/state)
	.get(function(req, res) {
		lmsInterface.getState(socketHost, socketPort, function(response){
			//TODO check response message - if ECONN reply with message like 500 instead of 200
			res.json(response);
		});
	});

// on routes that end in /create 
// ----------------------------------------------------
router.route('/create')
	// create a filter, path or pipe entity (accessed at POST http://localhost:8080/create)
	.post(function(req, res) {
		if(req.query.entity){
			switch (req.query.entity){
				case 'filter':
					lmsInterface.createFilter(socketHost, socketPort, req.query, new Filter(), function(response){
						//TODO check response message - if ECONN reply with message like 500 instead of 200
						res.json(response);
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
	})

// on routes that end in /configure 
// ----------------------------------------------------
router.route('/configure')

	// configure a filter type (accessed at POST http://localhost:8080/configure)
	.post(function(req, res) {
		if(req.query.type){
			switch (req.query.type){
				case 'videoEncoder':
					lmsInterface.configureVideoEncoder(socketHost, socketPort, req.query, new Filter(), function(response){
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
console.log('LMS API REST connecting to LMS host '+socketHost+' at port ' + socketPort);

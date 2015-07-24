// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var JsonSocket = require('./app/modules/lms-tcp-socket.js');

// configure app
app.use(morgan('dev')); // log requests to the console
var port     = process.env.PORT || 8080; // set our port

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure TCP socket
var socketPort     = 7777; // set our port
var socketHost     = '127.0.0.1'; // set our port

//configure DB
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

// ROUTES FOR OUR API
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

// on routes that end in /paths
// ----------------------------------------------------
router.route('/paths')

	// create a path (accessed at POST http://localhost:8080/paths)
	.post(function(req, res) {
		
		var path = new Path();		// create a new instance of the Paths model
		path.name = req.body.name;  // set the paths name (comes from the request)

		path.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Path created!' });
		});

		
	})

	// get all the paths (accessed at GET http://localhost:8080/api/paths)
	.get(function(req, res) {
		Path.find(function(err, paths) {
			if (err)
				res.send(err);

			res.json(paths);
		});
	});

// on routes that end in /paths/:path_id
// ----------------------------------------------------
router.route('/paths/:path_id')

	// get the path with that id
	.get(function(req, res) {
		Path.findById(req.params.path_id, function(err, path) {
			if (err)
				res.send(err);
			res.json(path);
		});
	})

	// update the path with this id
	.put(function(req, res) {
		Path.findById(req.params.path_id, function(err, path) {

			if (err)
				res.send(err);

			path.name = req.body.name;
			path.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Path updated!' });
			});

		});
	})

	// delete the path with this id
	.delete(function(req, res) {
		Path.remove({
			_id: req.params.path_id
		}, function(err, path) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /filter
// ----------------------------------------------------
router.route('/filter')

	// create a path (accessed at POST http://localhost:8080/paths)
	.post(function(req, res) {
		var message = 
		{ "events": [
		        {
		            "action": req.query.action,
		            "params": {
		                "id": parseInt(req.query.id),
		                "type": req.query.type,
		                "role": req.query.role,
		                "sharedFrames": true
		            }
		        } 
		    ] 
		};
		JsonSocket.sendSingleMessageAndReceive(socketPort, socketHost, 
			message, 
			function(err, message) {
			    if (err) {
			        //Something went wrong
			    	res.json({ message: err });
			    } else {
				    if(message.error != null){
					    	res.json({ message: message.error + ' Filter wasn\'t created'});
				    } else {
					    var filter = new Filter();		// create a new instance of the Filter model
						filter.id = req.query.id;
						filter.type = req.query.type;
						filter.role = req.query.role;
						filter.sharedFrames = true;
						filter.save(function(err) {
							if (err){
								//TODO: maybe better destroy filter at LMS side?
								res.json({ message: 'DB error!!! but ' +filter.type+ ' filter created with id ' + filter.id+'! Expect troubles...' });
							}
						});
					    res.json({ message: 'New ' +filter.type+ ' filter created with id ' + filter.id});
					}
			}
		});
	})

	// get the path with that id
	.get(function(req, res) {
		Filter.findById(req.params.id, function(err, filter) {
			if (err)
				res.send(err);
			res.json(filter);
		});
	})

	// update the path with this id
	.put(function(req, res) {
		Path.findById(req.params.path_id, function(err, path) {

			if (err)
				res.send(err);

			path.name = req.body.name;
			path.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Path updated!' });
			});

		});
	})

	// delete the path with this id
	.delete(function(req, res) {
		Path.remove({
			_id: req.params.path_id
		}, function(err, path) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LMS API REST listening on port ' + port);
console.log('LMS API REST connecting to LMS host '+socketHost+' at port ' + socketPort);

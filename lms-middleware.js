// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lms-middleware'); // connect to our database
var Path     = require('./app/models/path');

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


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LMS API REST listening on port ' + port);

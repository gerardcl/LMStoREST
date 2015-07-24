var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FilterSchema   = new Schema({
	id: Number,
	type: String,
	role: String,
	sharedFrames: Boolean
});

module.exports = mongoose.model('Filter', FilterSchema);

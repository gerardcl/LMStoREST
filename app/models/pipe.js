var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PipeSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('Pipe', PipeSchema);

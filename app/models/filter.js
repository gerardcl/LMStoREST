var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PathSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('Path', PathSchema);

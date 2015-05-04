var mongoose = require('mongoose');
var NetprojSchema = require('../schemas/netproj');
var Netproj = mongoose.model('Netproj', NetprojSchema);

module.exports = Netproj;
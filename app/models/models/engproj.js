var mongoose = require('mongoose');
var EngprojSchema = require('../schemas/engproj');
var Engproj = mongoose.model('Engproj',EngprojSchema);

module.exports = Engproj;
var mongoose = require('mongoose');
var CitygovprojSchema = require('../schemas/citygovproj');
var Citygovproj = mongoose.model('Citygovproj',CitygovprojSchema);

module.exports = Citygovproj;
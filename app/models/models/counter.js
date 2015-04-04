var mongoose = require('mongoose');
var CounterSchema = require('../schemas/counter');
var Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;

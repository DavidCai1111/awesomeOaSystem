var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({ 
    today:String,
    seq:Number
});

module.exports = CounterSchema;
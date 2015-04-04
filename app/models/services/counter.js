var Counter = require('../models/counter');
var util = require('util');

var counterService = {};

//获取序号保存日期
counterService.isToday = function(today,callback){
	Counter.findOne({today:today},function(err,counter){
		if(err){
			callback(err);
		}else{
			if(counter !== null){
				callback(null,true);
			}else{
				callback(null,false);
			}
		}
	});
};

//清空非今日的counter,并且建立当天的counter
counterService.init = function(today,callback){
	Counter.remove({},function(err,nRemoved){
		if(err){
			callback(err);
		}else{
			Counter.create({today:today,seq:1},function(err,counter){
				if(err){
					callback(err);
				}else{
					callback(null,counter);
				}
			});
		}
	});
};

//获取counter数，并且将counter数自增一
counterService.getSeqID = function(today,callback){
	var query = {today:today};
	Counter.findOne(query,function(err,counterFind){
		if(err){
			callback(err);
		}else{
			var seqIdNeed = counterFind.seq;
			Counter.findOneAndUpdate(query,{$inc:{seq:1}}, function (err,nUpdated) {
				if(err){
					callback(err);
				}else{
					callback(null,seqIdNeed);
				}
			});
		}
	});
};


module.exports = counterService;
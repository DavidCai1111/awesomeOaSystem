var Netproj = require('../models/netproj');
var netprojConfig = require('../../../config/projs/netproj');
var util = require('util');

var netprojService = {};

//获取所有项目
netprojService.getAll = function(callback){
    var netprojs = Netproj.find({});
    netprojs.exec(callback);
};

//保存项目
netprojService.save = function(netproj,callback){
    var netproj = new Netproj(netproj);
    netproj.save(function(err,netprojSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,netprojSaved);
        }
    });
};

//依据ID获取项目
netprojService.getById = function(id,callback){
    Netproj.findById(id,function(err,netproj){
        if(err){
            callback(err);
        }else{
            callback(null,netproj);
        }
    });
};

//更新项目
netprojService.updateOne = function(netproj,callback){
    Netproj.findByIdAndUpdate(netproj._id,netproj,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//依据id删除项目
netprojService.deleteById = function(ids,callback){
    Netproj.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

//生产符合node-xlsx要求的格式化数据
netprojService.getDataForExcel = function(netprojs){
	var data = [];
	for(var i = 0 ; i < netprojs.length ; i++){
		data[i] = [];
		for(var key in netprojs[i]){
			if(key === "basicInfo"|| key === "incomeInfo"){
				for(var innerKey in netprojs[i][key]){
					if(typeof(netprojs[i][key][innerKey]) === "string"){
						data[i] .push(netprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(netprojConfig.list);

	return data;
};

//上传了附件，更新数据库中的附件名
netprojService.updateUploadInfo = function (id,nameInFileInfo,filename,callback) {

	Netproj.findById(id, function (err,proj) {
		if(err){
			callback(err);
		}else{
			proj.fileInfo[nameInFileInfo] = filename;
			Netproj.findByIdAndUpdate(id,proj,function(err,nUpdated){
				if(err){
					console.log(err);
					callback(err);
				}else{
					callback(null,nUpdated);
				}
			});
		}
	});

};

module.exports = netprojService;
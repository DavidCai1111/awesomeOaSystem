var Engproj = require('../models/engproj');
var engprojConfig = require('../../../config/projs/engproj');
var util = require('util');

var engprojService = {};

//获取所有项目
engprojService.getAll = function(callback){
    var engprojs = Engproj.find({});
    engprojs.exec(callback);
};

//保存项目
engprojService.save = function(engproj,callback){
    var engproj = new Engproj(engproj);
    engproj.save(function(err,engprojSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,engprojSaved);
        }
    }

    );
};

//依据ID获取项目
engprojService.getById = function(id,callback){
    Engproj.findById(id,function(err,engproj){
        if(err){
            callback(err);
        }else{
            callback(null,engproj);
        }
    });
};

//更新项目
engprojService.updateOne = function(engproj,callback){
    Engproj.findByIdAndUpdate(engproj._id,engproj,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//依据id删除项目
engprojService.deleteById = function(ids,callback){
    Engproj.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

//生产符合node-xlsx要求的格式化数据
engprojService.getDataForExcel = function(engprojs){
	var data = [];
	for(var i = 0 ; i < engprojs.length ; i++){
		data[i] = [];
		for(var key in engprojs[i]){
			if(key === "basicInfo" || key === "materialInfo" || key === "constructionInfo" || key === "textInfo" || key === "contractInfo" || key === "incomeInfo"){
				for(var innerKey in engprojs[i][key]){
					if(typeof(engprojs[i][key][innerKey]) === "string"){
						data[i] .push(engprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(engprojConfig.list);

	return data;
};

//上传了附件，更新数据库中的附件名
engprojService.updateUploadInfo = function (id,nameInFileInfo,filename,callback) {

	Engproj.findById(id, function (err,proj) {
		if(err){
			callback(err);
		}else{
			proj.fileInfo[nameInFileInfo] = filename;
			Engproj.findByIdAndUpdate(id,proj,function(err,nUpdated){
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

module.exports = engprojService;
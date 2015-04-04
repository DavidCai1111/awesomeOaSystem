var Citygovproj = require('../models/citygovproj');
var citygovprojConfig = require('../../../config/projs/citygovproj');

var citygovprojService = {};

//获取所有项目
citygovprojService.getAll = function (callback) {
	var citygovprojs = Citygovproj.find({});
	citygovprojs.exec(callback);
};

//保存项目
citygovprojService.save = function (citygovproj, callback) {
	var citygovproj = new Citygovproj(citygovproj);
	citygovproj.save(function (err, citygovprojSaved) {
		if (err) {
			callback(err);
		} else {
			callback(null, citygovprojSaved);
		}
	});
};

//依据ID获取项目
citygovprojService.getById = function (id, callback) {
	Citygovproj.findById(id, function (err, citygovproj) {
		if (err) {
			callback(err);
		} else {
			callback(null, citygovproj);
		}
	});
};

//更新项目
citygovprojService.updateOne = function (citygovproj, callback) {
	Citygovproj.findByIdAndUpdate(citygovproj._id, citygovproj, function (err, nUpdated) {
		if (err) {
			callback(err);
		} else {
			callback(null, nUpdated);
		}
	});
};

//依据id删除项目
citygovprojService.deleteById = function (ids, callback) {
	Citygovproj.remove({_id: {$in: ids}}, function (err, nRemoved) {
		if (err) {
			callback(err);
		} else {
			callback(null, nRemoved);
		}
	});
};

//生产符合node-xlsx要求的格式化数据
citygovprojService.getDataForExcel = function (citygovprojs) {
	var data = [];
	for (var i = 0; i < citygovprojs.length; i++) {
		data[i] = [];
		for (var key in citygovprojs[i]) {
			if (key === "basicInfo" || key === "materialInfo" || key === "constructionInfo" || key === "textInfo" || key === "contractInfo" || key === "incomeInfo") {
				for (var innerKey in citygovprojs[i][key]) {
					if (typeof(citygovprojs[i][key][innerKey]) === "string") {
						data[i].push(citygovprojs[i][key][innerKey]);
					}
				}
			}
		}
		data[i].reverse();
	}

	data.unshift(citygovprojConfig.list);

	return data;
};


//上传了附件，更新数据库中的附件名
citygovprojService.updateUploadInfo = function (id, nameInFileInfo, filename, callback) {

	Citygovproj.findById(id, function (err, proj) {
		if (err) {
			callback(err);
		} else {
			proj.fileInfo[nameInFileInfo] = filename;
			Citygovproj.findByIdAndUpdate(id, proj, function (err, nUpdated) {
				if (err) {
					console.log(err);
					callback(err);
				} else {
					callback(null, nUpdated);
				}
			});
		}
	});

};

module.exports = citygovprojService;

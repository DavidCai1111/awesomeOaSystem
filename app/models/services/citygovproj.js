var Citygovproj = require('../models/citygovproj');
var citygovprojConfig = require('../../../config/projs/citygovproj');
var util = require('util');

var citygovprojService = {};

//获取所有项目
citygovprojService.getAll = function (callback) {
  Citygovproj.find({}, null, {sort: {'basicInfo.serialno': -1}}, function (err, engprojs) {
    if (err) {
      callback(err);
    } else {
      callback(null, engprojs)
    }
  });
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
citygovprojService.updateOne = function (id, citygovproj, callback) {
  Citygovproj.findByIdAndUpdate(id, {$set: citygovproj}, function (err, nUpdated) {
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

//获取图表展示需要的收入相关信息
citygovprojService.getAllIncomeInfo = function (callback) {

  Citygovproj.find({}, 'incomeInfo.income incomeInfo.outcome incomeInfo.otherfee incomeInfo.profit basicInfo.projtype', function (err, projs) {
    if (err) {
      callback(err);
    } else {
      //初始化
      var incomeInfo = {
        light: {
          income: 0,
          outcome: 0,
          otherfee: 0,
          profit: 0
        },
        overlay: {
          income: 0,
          outcome: 0,
          otherfee: 0,
          profit: 0
        }
      };

      for (var i = 0; i < projs.length; i++) {
        if (projs[i].basicInfo.projtype === "光交网") {
          formatIncomeInfo(projs[i], incomeInfo.light);
        } else {
          formatIncomeInfo(projs[i], incomeInfo.overlay);
        }
      }

      function formatIncomeInfo(proj, incomeInfo) {
        var _income = parseInt(proj.incomeInfo.income);
        var _outcome = parseInt(proj.incomeInfo.outcome);
        var _otherfee = parseInt(proj.incomeInfo.otherfee);
        var _profit = parseInt(proj.incomeInfo.profit);
        if (!isNaN(_income)) {
          incomeInfo.income += _income;
        }
        if (!isNaN(_outcome)) {
          incomeInfo.outcome -= _outcome;
        }
        if (!isNaN(_otherfee)) {
          incomeInfo.otherfee -= _otherfee;
        }
        if (!isNaN(_profit)) {
          incomeInfo.profit += _profit;
        }
      }

      callback(null, incomeInfo)
    }
  });
};

module.exports = citygovprojService;

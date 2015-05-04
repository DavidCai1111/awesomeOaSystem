var Engproj = require('../models/engproj');
var engprojConfig = require('../../../config/projs/engproj');
var util = require('util');

var engprojService = {};

//获取所有项目
engprojService.getAll = function (callback) {
  Engproj.find({}, null, {sort: {'basicInfo.serialno': -1}}, function (err, engprojs) {
    if (err) {
      callback(err);
    } else {
      callback(null, engprojs)
    }
  });
};

//保存项目
engprojService.save = function (engproj, callback) {
  var engproj = new Engproj(engproj);
  engproj.save(function (err, engprojSaved) {
      if (err) {
        callback(err);
      } else {
        callback(null, engprojSaved);
      }
    }
  );
};

//依据ID获取项目
engprojService.getById = function (id, callback) {
  Engproj.findById(id, function (err, engproj) {
    if (err) {
      callback(err);
    } else {
      callback(null, engproj);
    }
  });
};

//更新项目
engprojService.updateOne = function (id, engproj, callback) {
  Engproj.findByIdAndUpdate(id, {$set: engproj}, function (err, nUpdated) {
    if (err) {
      callback(err);
    } else {
      callback(null, nUpdated);
    }
  });
};

//依据id删除项目
engprojService.deleteById = function (ids, callback) {
  Engproj.remove({_id: {$in: ids}}, function (err, nRemoved) {
    if (err) {
      callback(err);
    } else {
      callback(null, nRemoved);
    }
  });
};

//生产符合node-xlsx要求的格式化数据
engprojService.getDataForExcel = function (engprojs) {
  var data = [];
  for (var i = 0; i < engprojs.length; i++) {
    data[i] = [];
    for (var key in engprojs[i]) {
      if (key === "basicInfo" || key === "materialInfo" || key === "constructionInfo" || key === "textInfo" || key === "contractInfo" || key === "incomeInfo") {
        for (var innerKey in engprojs[i][key]) {
          if (typeof(engprojs[i][key][innerKey]) === "string") {
            data[i].push(engprojs[i][key][innerKey]);
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
engprojService.updateUploadInfo = function (id, nameInFileInfo, filename, callback) {

  Engproj.findById(id, function (err, proj) {
    if (err) {
      callback(err);
    } else {
      proj.fileInfo[nameInFileInfo] = filename;
      Engproj.findByIdAndUpdate(id, proj, function (err, nUpdated) {
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
engprojService.getAllIncomeInfo = function (callback) {

  Engproj.find({}, 'incomeInfo.income incomeInfo.outcome incomeInfo.otherfee incomeInfo.profit basicInfo.projtype', function (err, projs) {
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

module.exports = engprojService;

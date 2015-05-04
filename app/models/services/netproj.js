var Netproj = require('../models/netproj');
var netprojConfig = require('../../../config/projs/netproj');
var util = require('util');

var netprojService = {};

//获取所有项目
netprojService.getAll = function (callback) {
  Netproj.find({}, null, {sort: {'basicInfo.serialno': -1}}, function (err, engprojs) {
    if (err) {
      callback(err);
    } else {
      callback(null, engprojs)
    }
  });
};

//保存项目
netprojService.save = function (netproj, callback) {
  var netproj = new Netproj(netproj);
  netproj.save(function (err, netprojSaved) {
    if (err) {
      callback(err);
    } else {
      callback(null, netprojSaved);
    }
  });
};

//依据ID获取项目
netprojService.getById = function (id, callback) {
  Netproj.findById(id, function (err, netproj) {
    if (err) {
      callback(err);
    } else {
      callback(null, netproj);
    }
  });
};

//更新项目
netprojService.updateOne = function (id, netproj, callback) {
  Netproj.findByIdAndUpdate(id, {$set: netproj}, function (err, nUpdated) {
    if (err) {
      callback(err);
    } else {
      callback(null, nUpdated);
    }
  });
};

//依据id删除项目
netprojService.deleteById = function (ids, callback) {
  Netproj.remove({_id: {$in: ids}}, function (err, nRemoved) {
    if (err) {
      callback(err);
    } else {
      callback(null, nRemoved);
    }
  });
};

//生产符合node-xlsx要求的格式化数据
netprojService.getDataForExcel = function (netprojs) {
  var data = [];
  for (var i = 0; i < netprojs.length; i++) {
    data[i] = [];
    for (var key in netprojs[i]) {
      if (key === "basicInfo" || key === "incomeInfo") {
        for (var innerKey in netprojs[i][key]) {
          if (typeof(netprojs[i][key][innerKey]) === "string") {
            data[i].push(netprojs[i][key][innerKey]);
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
netprojService.updateUploadInfo = function (id, nameInFileInfo, filename, callback) {

  Netproj.findById(id, function (err, proj) {
    if (err) {
      callback(err);
    } else {
      proj.fileInfo[nameInFileInfo] = filename;
      Netproj.findByIdAndUpdate(id, proj, function (err, nUpdated) {
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
netprojService.getAllIncomeInfo = function (callback) {

  Netproj.find({}, 'incomeInfo.income incomeInfo.outcome incomeInfo.otherfee incomeInfo.profit basicInfo.projtype', function (err, projs) {
    if (err) {
      callback(err);
    } else {
      //初始化
      var incomeInfo = {
        rushRepair: {
          income: 0,
          outcome: 0,
          otherfee: 0,
          profit: 0
        },
        overhaul: {
          income: 0,
          outcome: 0,
          otherfee: 0,
          profit: 0
        },
        minorRepair: {
          income: 0,
          outcome: 0,
          otherfee: 0,
          profit: 0
        }
      };

      for (var i = 0; i < projs.length; i++) {
        if (projs[i].basicInfo.projtype === "抢修") {
          formatIncomeInfo(projs[i], incomeInfo.rushRepair);
        } else if (projs[i].basicInfo.projtype === "大修") {
          formatIncomeInfo(projs[i], incomeInfo.overhaul);
        }
        else {
          formatIncomeInfo(projs[i], incomeInfo.minorRepair);
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

module.exports = netprojService;

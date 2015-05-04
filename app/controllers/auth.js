var util = require('util');
var crypto = require('crypto');
var eventProxy = require('eventproxy');
var UserService = require('../models/services/user');
var EngprojService = require('../models/services/engproj');
var NetprojService = require('../models/services/netproj');
var CitygovprojService = require('../models/services/citygovproj');

module.exports = function (app) {

  app.get('/', checkLogin, function (req, res) {
    console.dir(req.session.user);

    var ep = eventProxy.create("engproj", "netproj", "citygovproj", function (engproj, netproj, citygovproj) {
      var incomeInfo = {};
      incomeInfo.engproj = engproj;
      incomeInfo.netproj = netproj;
      incomeInfo.citygovproj = citygovproj;

      res.render('index', {
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        incomeInfo: JSON.stringify(incomeInfo)
      });
    });

    EngprojService.getAllIncomeInfo(function (err, incomeInfo) {
      ep.emit("engproj", incomeInfo);
    });

    NetprojService.getAllIncomeInfo(function (err, incomeInfo) {
      ep.emit("netproj", incomeInfo);
    });

    CitygovprojService.getAllIncomeInfo(function (err, incomeInfo) {
      ep.emit("citygovproj", incomeInfo);
    });

  });

  app.get('/login', checkNotLogin, function (req, res) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });


  app.post('/login', checkNotLogin, function (req, res) {
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');

    UserService.getByName(req.body.name, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在!');
        return res.json({error: 0});
      } else if (user.password != password) {
        req.flash('error', '密码错误!');
        return res.json({error: 1});
      } else {
        req.flash('error', '登陆成功!');
        req.session.user = user;
        return res.json({error: 2});
      }
    });

  });

  app.get('/logout', checkLogin, function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '已登出!');
      return res.redirect('/login');
    }
    return next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!');
      return res.redirect('/');
    }
    return next();
  }
};

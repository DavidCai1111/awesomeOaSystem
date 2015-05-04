var crypto = require('crypto');
var UserService = require('../models/services/user');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

  app.get('/user', checkLogin, function (req, res) {
    //获取所有用户
    UserService.getAll(function (err, users) {
      if (err) {
        users = [];
      }
      res.render('user', {
        title: '用户管理',
        user: req.session.user,
        users: users,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

//app.post('/user', checkNotLogin);
  app.post('/user', function (req, res) {
    var user = req.body.user;
    name = user.name,
      password = user.password,
      password_re = user['vpassword'];
    if (password_re !== password) {
      return res.send({
        success: false,
        msg: "两次输入的密码不一致"
      });
    }
    var md5 = crypto.createHash('md5'),
      password = md5.update(user.password).digest('hex');

    //获取当前日期
    var dateNow = new Date();
    var createAt = dateNow.getFullYear() + "/" + (dateNow.getMonth() + 1) + "/" + dateNow.getDate();

    var newUser = {
      name: name,
      password: password,
      email: user.email,
      phone: user.phone,
      depart: user.depart,
      city: user.city,
      authority: user.authority,
      date: createAt
    };
    UserService.getByName(newUser.name, function (err, user) {
      if (user) {
        return res.send({
          success: false,
          msg: "用户名已存在"
        });
      }
      UserService.save(newUser, function (err, user) {
        if (err) {
          return res.send({
            success: false,
            msg: "数据存储出错"
          });
        }
        return res.send({
          success: true
        });
      });
    });
  });

  //删除用户
  app.delete('/user', function (req, res) {
    var idsToDelete = req.body;
    UserService.deleteById(idsToDelete, function (err, nRemoved) {
      if (err) {
        console.log(err);
        req.flash('error', err);
        return res.send({result: "delete failed"});
      }
      //删除用户头像
      for (var i = 0; i < idsToDelete.length; i++) {
        if (fs.existsSync(path.join(__dirname, "../../public/images/portrait/", (idsToDelete[i] + '.png')))) {
          fs.unlinkSync(path.join(__dirname, "../../public/images/portrait/", (idsToDelete[i] + '.png')));
        }
      }
      //如果删除了当前登录用户，则跳转回首页
      for (var j = 0; j < idsToDelete.length; j++) {
        if (idsToDelete[j] === req.session.user._id) {
          delete req.session.user;
          return res.send({result: "delete itself"});
        }
      }
      return res.send({result: "delete success"});
    });
  });

  //获取用户ID，返回该ID用户
  app.post('/user/getById', function (req, res) {
    var id = req.body.id;
    UserService.getById(id, function (err, user) {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.send({result: "getUserById failed"});
      }
      return res.send(user);
    });
  });

  //修改用户信息
  app.post('/user/update', function (req, res) {
    var userToUpdate = req.body.user;
    //验证用户名是否被占用
    UserService.findUserNameIsUsedByOthers(userToUpdate, function (err, user) {
      if (user.length != 0) {
        return res.send({
          success: false,
          msg: "用户名已被占用"
        });
      }
      UserService.updateOne(userToUpdate, function (err, nUpdate) {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            msg: "数据存储出错"
          });
        }
        //若更改的是当前用户，更新session中的用户信息
        if (userToUpdate._id === req.session.user._id) {
          for (var val in userToUpdate) {
            req.session.user[val] = userToUpdate[val];
          }
        }
        return res.send({
          success: true
        });
      });
    });
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
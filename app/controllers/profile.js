var crypto = require('crypto');
var UserService = require('../models/services/user');
var util = require('util');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {

  app.get('/profile', checkLogin, function (req, res) {

    if (req.query.q === 'succeed') {
      res.render('profile', {
        title: '个人信息',
        info: '更新成功',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    } else {
      res.render('profile', {
        title: '个人信息',
        info: '',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    }
  });

  app.post('/profile/validatePassword', checkLogin, function (req, res) {
    var userToValidate = req.body.user;
    var md5 = crypto.createHash('md5'),
      passwordMd5 = md5.update(userToValidate.passwordNow).digest('hex');

    userToValidate.passwordNow = passwordMd5;

    if (userToValidate.passwordNow === "" || userToValidate.newPassword === "" || userToValidate.reNewPassword === "") {
      res.send({success: false, msg: '密码不能为空'});
      return;
    }

    UserService.validatePassword(userToValidate._id, userToValidate.passwordNow, function (err, result) {
      if (err) {
        console.log(err);
        res.send({success: false, msg: '数据库错误'});
      }

      if (result === true) {
        res.send({success: true, msg: '验证通过'});
      } else {
        res.send({success: false, msg: '验证不通过'});
      }
    })

  });

  //修改用户信息
  app.post('/profile/update', checkLogin, function (req, res) {
    var userToUpdate = req.body.user;

    //检查是否修改密码
    if (userToUpdate.newPassword !== '') {
      var md5 = crypto.createHash('md5'),
        passwordMd5 = md5.update(userToUpdate.newPassword).digest('hex');
      userToUpdate.password = passwordMd5;
    }


    //删除密码验证数据
    delete userToUpdate.passwordNow;
    delete userToUpdate.newPassword;
    delete userToUpdate.reNewPassword;

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

        //更新session
        if (userToUpdate.password !== '') {
          var _password = userToUpdate.password;
          for (var val in userToUpdate) {
            req.session.user[val] = userToUpdate[val];
          }
          req.session.user.password = _password;
        } else {
          var _password = req.session.user.password;
          for (var val in userToUpdate) {
            req.session.user[val] = userToUpdate[val];
          }
          req.session.user.password = _password;
        }

        return res.send({
          success: true
        });

      });
    });
  });

  app.post('/profile/uploadPortrait', checkLogin, function (req, res) {

    //获取头像的文件名,更改头像的用户的_id
    var filename;
    var _id;

    //获取文件信息
    for (file in req.files) {
      filename = req.files[file].fieldname + '.png';
      _id = file;
    }

    res.type("html");

    //格式,大小检查不通过
    if (req.body.fileValidationOk !== true) {
      return res.send(false);
    }

    //更改数据库中用户头像字段，并返回更改成功
    if (fs.existsSync(path.join(__dirname, "../../public/images/portrait/", filename))) {
      UserService.hasPortrait(_id, function (err, nUpdated) {
        if (err) {
          console.log(err);
          return res.send(false);
        }
        //更新session
        req.session.user.hasPortrait = true;
        return res.send(true);
      });
    } else {
      return res.send(false);
    }

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
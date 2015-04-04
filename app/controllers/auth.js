var crypto = require('crypto');
var UserService = require('../models/services/user');

module.exports = function (app) {

    app.get('/', checkLogin , function (req, res) {

        res.render('index', {
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });

    app.get('/login', checkNotLogin , function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });


    app.post('/login', checkNotLogin , function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        UserService.getByName(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.json({error:0});
            }else if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.json({error:1});
            }else {
                req.flash('error', '登陆成功!');
                req.session.user = user;
                return res.json({error:2});
            }
        });

    });

    app.get('/logout', checkLogin , function (req, res) {
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
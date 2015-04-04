var User = require('../models/user');
var crypto = require('crypto');

var userService = {};

//依据传入的user对象向mongodb插入用户
userService.save = function(user,callback){
    var user = new User(user);
    user.save(function(err,userSaved){
        if(err) {
            callback(err);
        }else{
            callback(null,userSaved);
        }
    });
};

//获取所有用户
userService.getAll = function(callback){
    var users = User.find({}).sort('-name');
    users.exec(callback);
};

//依据用户名获取用户
userService.getByName = function(userName , callback){
    User.findOne({name:userName},function(err,user){
        if(err){
            callback(err);
        }else{
            callback(null,user);
        }
    });
};

//依据id删除用户
userService.deleteById = function(ids,callback){
    User.remove({_id:{$in:ids}},function(err,nRemoved){
        if(err){
            callback(err);
        }else{
            callback(null,nRemoved);
        }
    });
};

//依据id获取用户
userService.getById = function(id,callback){
    User.findById(id,function(err,user){
        if(err){
            callback(err);
        }else{
            callback(null,user);
        }
    });
};

//检查用户名是否被他人占用
userService.findUserNameIsUsedByOthers = function(user,callback){
    User.find({name:user.name,_id:{$ne:user._id}},function(err,user){
        if(err){
            callback(err);
        }else{
            callback(null,user);
        }
    });
};

//更新一名用户
userService.updateOne = function(user,callback){
    User.findByIdAndUpdate(user._id,user,function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

//根据id验证密码
userService.validatePassword = function(id,password,callback){
    User.findById(id,function(err,user){
        if(err){
            callback(err);
        }else{
            if(password === user.password){
                callback(null,true);
            }else{
                callback(null,false);
            }
        }
    });
};

//将用户更新为拥有头像
userService.hasPortrait = function(id,callback){
    User.findByIdAndUpdate(id,{hasPortrait:true},function(err,nUpdated){
        if(err){
            callback(err);
        }else{
            callback(null,nUpdated);
        }
    });
};

module.exports = userService;


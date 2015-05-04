var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  //个人信息
  name: {
    unique: true,
    type: String
  },
  password: String,
  email: String,
  phone: String,
  depart: String,
  city: String,
  date: String,
  hasPortrait: {type: Boolean, default: false},
  //是否为admin(拥有所有权限)
  isAdmin: {type: Boolean, default: false},
  //权限
  authority: {
    //工程公司项目
    engprojControl: {
      visible: {type: Boolean, default: false},
      basicInfo: {type: Boolean, default: false},
      materialInfo: {type: Boolean, default: false},
      constructionInfo: {type: Boolean, default: false},
      textInfo: {type: Boolean, default: false},
      contractInfo: {type: Boolean, default: false},
      incomeInfo: {type: Boolean, default: false}
    },
    //网络部项目
    netprojControl: {
      visible: {type: Boolean, default: false},
      basicInfo: {type: Boolean, default: false},
      incomeInfo: {type: Boolean, default: false}
    },
    //市政项目管理
    citygovprojControl: {
      visible: {type: Boolean, default: false},
      basicInfo: {type: Boolean, default: false},
      materialInfo: {type: Boolean, default: false},
      constructionInfo: {type: Boolean, default: false},
      textInfo: {type: Boolean, default: false},
      contractInfo: {type: Boolean, default: false},
      incomeInfo: {type: Boolean, default: false},
      seeNotInStatis: {type: Boolean, default: false}
    }
  }
});

module.exports = UserSchema;
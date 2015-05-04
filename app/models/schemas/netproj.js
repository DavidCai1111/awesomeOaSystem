var mongoose = require('mongoose');

var NetprojSchema = new mongoose.Schema({
  //基本信息
  basicInfo: {
    serialno: String,//序号
    billno: String,//工单号
    firstpartyofficer: String, //甲方项目负责人
    secondpartyofficer: String,//乙方项目负责人
    properties: String,//项目属性
    projtype: String,//项目类别
    reason: String,//实施原因
    name: String,//项目名称
    address: String,//工程地址
    area: String,//所属区域
    constrctteam: String,//施工队
    constrctofficer: String,//施工队负责人
    consigntime: String,//委托时间
    situation: String,//立项情况
    constructbegintime: String,//开工时间
    finishtime: String,//完工时间
    textreceivetime: String,//竣工图纸收到日期（附件）
    firstpartyacptstatus: String,//甲方验收情况
    inspecttime: String,//送审日期（附件）
    basiccomments: String//备注
  },
  //收入信息
  incomeInfo: {
    budget: {type: String, default: "0"},//预算
    clearing: {type: String, default: "0"},//结算
    voiceamount: {type: String, default: "0"},//开票金额（附件）
    income: {type: String, default: "0"},//实际收款
    outcome: {type: String, default: "0"},//施工队结款
    worktable: String,//施工队工作量表格
    otherfee: {type: String, default: "0"},//其他费用
    profit: {type: String, default: "0"},//利润
    incomecomments: String//备注
  },
  //附件文件信息
  fileInfo: {
    voiceamountFileName: {type: String, default: "无"},//开票金额附件名
    inspecttimeFileName: {type: String, default: "无"},//送审日期附件名
    textreceivetimeFileName: {type: String, default: "无"}//竣工图纸收到日期附件名
  }
});

module.exports = NetprojSchema;

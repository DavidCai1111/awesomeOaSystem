var mongoose = require('mongoose');

var CitygovprojSchema = new mongoose.Schema({
    //基本信息
    basicInfo:{
        serialno :String,//序号
        isstatis  : String,//是否统计
        controlid :String, //受控编号
        projname :String,//工程名称
        firstpartyofficer : String,//甲方项目负责人
        projtype : String,//项目类别
        properties : String,//工程属性
        subname : String,//项目名称
        content : String,//项目内容
        address : String,//工程地址
        firstparty : String,//甲方单位
        area : String,//所属区域
        designorg : String,//设计单位
        designofficer : String,//设计负责人
        supvorg : String,//监理单位
        supvofficer : String,//监理负责人
        constructteam : String,//施工队
        basiccomments : String//备注
    },
    //材料信息
    materialInfo:{
        materialoffer:String,//主材料使用（乙供）
        materialamont :String//主材料金额（乙供）
    },
    //施工情况信息
    constructionInfo : {
        changeoverreport : String,//割接报告申请
        changeoverreportapplytime : String,//割接报告申请日期
        changeovertime : String,//割接日期
        begintime : String,//开工时间
        endtime : String,//完工时间
        constructioncomments : String//备注
    },
    //资料信息
    textInfo : {
        text : String,//竣工文本（甲方下发）收到情况
        textreceivetime : String,//竣工文本收到日期
        textsubmittime : String,//竣工文本提交日期
        compmatres : String,//甲方对竣工资料的反馈情况
        compsubmittime : String,//竣工资料（施工队给乙方）提交时间
        isreceived : String,//竣工资料是否收到
        worktable : String//施工队工作量（表格）
    },
    //合同信息
    contractInfo : {
        firstpartycontractyamount : String,//甲方合同金额
        firstpartyisreceived : String,//甲方是否已收款
        trans : String,//是否转其他公司
        secondpartycontracttime : String,//乙方合同签订日期
        secondpartycontractamount : String,//乙方合同金额
        secondpartyaudittime : String,//乙方送审日期
        secondpartyauditamount : String,//乙方审定金额
        secondpartyproceprepaytime : String,//乙方预付款开票日期（附件）
        secondpartyproceprepayamount : String,//乙方预付款开票金额
        secondpartyprocetime : String,//乙方进度款开票日期（附件）
        secondpartyproceamount : String,//乙方进度款开票金额
        secondpartyfinaltime : String,//乙方尾款开票日期（附件）
        secondpartyfinalamount : String,//乙方尾款开票金额
        secondpartyprepaytime : String,//乙方预付款到款日期
        secondpartyprepayamount : String,//乙方预付款到款金额
        secondpartypropaytime : String,//乙方进度款到款日期
        secondpartypropayamount : String,//乙方进度款到款金额
        secondpartyfinalpaytime : String,//乙方尾款到款日期
        secondpartyfinalpayaount : String,//乙方尾款到款金额
        contracttime : String,//我公司合同签订日期
        contracttext : String,//合同文本（附件）
        contractamount : String,//我公司合同款金额
        prepayvoicetime : String,//我公司合同预付款开票日期（附件）
        prepayvoiceamount : String,//我公司合同预付款开票金额
        propayvoicetime : String,//我公司合同进度款开票日期（附件）
        propayvoiceamount : String,//我公司合同进度款开票金额
        finalpayvoicetime : String,//我公司合同尾款开票日期（附件）
        finalpayvoiceamount : String,//我公司合同尾款开票金额
        prepayouttime : String,//我公司合同预付款到款日期
        prepayoutamount : String,//我公司合同预付款到款金额
        propayouttime : String,//我公司合同进度款到款日期
        propayoutamount : String,//我公司合同进度款到款金额
        audittime : String,//我公司送审日期
        auditamount : String//我公司审定金额
    },
    //收入信息
    incomeInfo : {
        income : String,//实际收款
        outcome : String,//施工队结款
        otherfee : String,//其他费用
        profit :String,//利润
    },
	//附件文件信息
	fileInfo : {
		finalpayvoicetimeFileName : {type:String,default:"无"},//我公司合同尾款开票日期附件名
		propayvoicetimeFileName : {type:String,default:"无"},//我公司合同进度款开票日期附件名
		prepayvoicetimeFileName : {type:String,default:"无"},//我公司合同预付款开票日期附件名
		contracttextFileName : {type:String,default:"无"},//合同文本附件名
		secondpartyfinaltimeFileName : {type:String,default:"无"},//乙方尾款开票日期附件名
		secondpartyprocetimeFileName : {type:String,default:"无"},//乙方进度款开票日期附件名
		secondpartyproceprepaytimeFileName : {type:String,default:"无"}//乙方预付款开票日期附件名
	}
});

module.exports = CitygovprojSchema;
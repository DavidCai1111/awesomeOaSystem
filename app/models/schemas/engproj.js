var mongoose = require('mongoose');

var EngprojSchema = new mongoose.Schema({
    //基本信息
    basicInfo:{
        serialno :String,//序号
        transid : String,//传输编号
        controlid :String, //受控编号
        projname :String,//工程名称
        firstpartyofficer : String,//甲方项目负责人
        secondpartyofficer : String,//乙方项目负责人
        projtype : String,//项目类别
        properties : String,//工程属性
        subname : String,//项目名称
        address : String,//工程地址
        firstparty : String,//甲方单位
        area : String,//所属区域
        designorg : String,//设计单位
        designofficer : String,//设计负责人
        supvorg : String,//监理单位
        supvofficer : String,//监理负责人
        constructteam : String,//施工队
        constructofficer : String,//施工队负责人
        consigntime : String,//委托时间
        basiccomments : String//备注
    },
    //材料信息
    materialInfo:{
        materialoffer:String,//主材料供应
        applytime :String,//申请领料日期（甲供）
        actualtime : String,//实际领料日期（甲供）
        materialamount : String,//主材料金额（乙供）
        materialtable : String,//材料表
        materialcomments : String//备注
    },
    //施工情况信息
    constructionInfo : {
        constructstatus : String,//施工情况
        constructdesc : String,//施工情况简述
        expectfinishtime : String,//预计完工时间
        constructbegintime : String,//开工时间
        finishtime : String,//完工时间
        supervacptstatus : String,//监理验收情况
        supervacceptres : String,//监理验收问题反馈
        firstpartyacptstatus : String,//甲方验收情况
        isadmin : String,//管照办理情况
        withfee : String,//配合费（附件）
        linefee : String,//选线费（附件）
        testfee : String,//跟测费（附件）
        comments : String//备注
    },
    //资料信息
    textInfo : {
        comptextrectime : String,//竣工文本收到日期
        compmatcommittime : String,//竣工资料施工队上交时间（附件）
        comptextcommittime : String,//竣工文本提交日期（附件）
        compmatres : String,//甲方对竣工资料的反馈情况
        worktable : String,//施工队工作量（表格）
        textcomments : String//备注
    },
    //合同信息
    contractInfo : {
        contractstatus : String,//合同签订情况
        contracttime : String,//合同签订日期
        contract : String,//合同文本（附件）
        contractamount : String,//合同总金额
        prepay : String,//预付款
        prepayindate : String,//预付款开票日期（附件）
        prepayoutdate : String,//预付款收款日期
        propayindate : String,//进度款开票日期（附件）
        propayoutdate : String,//进度款收款日期
        finalpayindate : String,//尾款开票日期（附件）
        finalpayoutdate : String,//尾款收款日期
        isinspect : String,//是否已送审（附件）
        inspecttime : String,//送审日期
        inspectamount : String,//审定金额
        contractcomments : String//备注
    },
    //收入信息
    incomeInfo : {
        income : String,//实际收款
        outcome : String,//施工队结款
        otherfee : String,//其他费用
        profit :String,//利润
        incomecomments : String//备注
    },
	//附件文件信息
	fileInfo : {
		withfeeFileName : {type:String,default:"无"},//配合费附件名
		linefeeFileName : {type:String,default:"无"},//选线费附件名
		testfeefeeFileName : {type:String,default:"无"},//跟测费附件名
		compmatcommittimeFileName : {type:String,default:"无"},//竣工资料施工队上交时间附件名
		comptextcommittimeFileName : {type:String,default:"无"},//竣工文本提交日期附件名
		contractFileName : {type:String,default:"无"},//合同文本附件名
		prepayindateFileName : {type:String,default:"无"},//预付款开票日期附件名
		propayindateFileName : {type:String,default:"无"},//进度款开票日期附件名
		finalpayindateFileName : {type:String,default:"无"},//尾款开票日期附件名
		isinspectFileName : {type:String,default:"无"}//是否已送审附件名
	}
});

module.exports = EngprojSchema;
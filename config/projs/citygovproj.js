var citygovproj = {};

citygovproj.list = ["序号", "是否统计", "受控编号", "工程名称", "甲方项目负责人", "项目类别", "工程属性", "项目名称", "项目内容", "工程地址", "甲方单位", "所属区域", "设计单位", "设计负责人", "监理单位", "监理负责人", "施工队", "备注"
  , "主材料使用（乙供）", "主材料金额（乙供）"
  , "割接报告申请", "割接报告申请日期", "割接日期", "开工时间", "完工时间", "备注"
  , "竣工文本（甲方下发）收到情况", "竣工文本收到日期", "竣工文本提交日期", "甲方对竣工资料的反馈情况", "竣工资料（施工队给乙方）提交时间", "竣工资料是否收到", "施工队工作量（表格）"
  , "甲方合同金额", "甲方是否已收款", "是否转其他公司", "乙方合同签订日期", "乙方合同金额", "乙方送审日期", "乙方审定金额", "乙方预付款开票日期（附件）", "乙方预付款开票金额", "乙方进度款开票日期（附件）", "乙方进度款开票金额", "乙方尾款开票日期（附件）", "乙方尾款开票金额", "乙方预付款到款日期", "乙方预付款到款金额", "乙方进度款到款日期", "乙方进度款到款金额", "乙方尾款到款日期", "乙方尾款到款金额", "我公司合同签订日期", "合同文本（附件）", "我公司合同款金额", "我公司合同预付款开票日期（附件）", "我公司合同预付款开票金额", "我公司合同进度款开票日期（附件）", "我公司合同进度款开票金额", "我公司合同尾款开票日期（附件）", "我公司合同尾款开票金额", "我公司合同预付款到款日期", "我公司合同预付款到款金额", "我公司合同进度款到款日期", "我公司合同进度款到款金额", "我公司送审日期", "我公司审定金额"
  , "实际收款", "施工队结款", "其他费用", "利润"];

citygovproj.selectOptions = {};

//工程属性
citygovproj.selectOptions.propertiesList = ['管道', '光缆', '设备', '客户端'];

//甲方单位
citygovproj.selectOptions.firstpartyList = ['中国移动', '中国联通'];

//所属区域
citygovproj.selectOptions.areaList = ['黄浦', '卢湾', '徐汇', '长宁', '静安', '普陀',
  '闸北', '虹口', '杨浦', '宝山', '嘉定', '浦东新区', '松江', '金山',
  '青浦', '南汇', '奉贤', '崇明'];

//设计单位
citygovproj.selectOptions.designorgList = ['京移', '邮设', '华信'];

//监理单位
citygovproj.selectOptions.supvorgList = ['公诚', '信产', '华讯', '铁二院', '黑龙江', '网桥'];

//施工队
citygovproj.selectOptions.constructteamList = ['中邮通', '中移', '邮电', '广越', '东冠', '和勤', '电信', '久豪', '贝电', '海润', '中通二局', '翔发',
  '辉程', '龙盛', '明嬴', '盛脉', '通福', '万程', '信辰', '远鹰', '阅龙', '置诚', '兆康', '兴霸', '和联', '鸿维', '嘉正', '炜晟', '新周',
  '信潮', '众托', '共联', '中福', '长安', '都顺', '联音', '商美', '英得', '亚通', '邮顺', '渝华', '忠吕', '中铁', '天达', '虹鹰', '兴和',
  '云沪', '雨花', '晟平', '秦禧', '立天', '中通一局', '博索', '富悦', '廉创', '润风', '海剑', '宏晋', '米赛', '伟琳', '骥通', '北京工程局',
  '景合', '海缆', '煜菱', '鸿达'];

//甲方对竣工资料的反馈情况
citygovproj.selectOptions.compmatresList = ['已反馈', '未反馈'];

//竣工资料是否收到
citygovproj.selectOptions.isreceivedList = ['是', '否'];

//甲方是否已收款
citygovproj.selectOptions.firstpartyisreceivedList = ['是', '否'];

//是否转其他公司
citygovproj.selectOptions.transList = ['是', '否'];

module.exports = citygovproj;
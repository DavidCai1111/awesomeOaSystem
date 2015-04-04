var EngprojService = require('../models/services/engproj');
var CounterService = require('../models/services/counter');
var moment = require('moment');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');

module.exports = function (app) {

    app.get('/engineeringproj', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
                console.log(err);
                engprojs = [];
            }
            res.render('engineeringproj', {
                title: '工程公司项目管理',
                user: req.session.user,
                engprojs: engprojs,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    //删除项目
    app.delete('/engineeringproj', checkLogin , function (req, res) {
        var idsToDelete = req.body;
        EngprojService.deleteById(idsToDelete,function(err,nRemoved){
            if(err){
                console.log(err);
                req.flash('error', err);
                return res.send({success:false});
            }
	        //遍历删除对应项目附件
	        for(var i = 0 ; i < idsToDelete.length ; i++){
		        fse.removeSync(path.join(__dirname,("../../public/attachment/engproj/" + idsToDelete[i])));
	        }
            return res.send({success:true});
        });
    });

    //保存项目
    app.post('/engineeringproj/save',checkLogin,function(req,res){
        var proj = req.body.proj;
        var today = moment().format('YYYYMMDD');


	    //检查counter中日期
		CounterService.isToday(today, function (err,result) {
			if(err){
				return res.send({
					success:false,
					msg:"数据存储出错"
				});
			}
			if(result === true){
				//是当日
				CounterService.getSeqID(today, function (err,seqId) {
					if(err){
						return res.send({
							success:false,
							msg:"数据存储出错"
						});
					}

					//seqId补零
					if(parseInt(seqId) < 10){
						seqId = "00" + seqId;
					}else if(parseInt(seqId)  < 100){
						seqId = "0" + seqId
					}

					proj.basicInfo.serialno = "GC" + today + seqId;

					//保存
					EngprojService.save(proj,function (err, proj) {
						if (err) {
							return res.send({
								success:false,
								msg:"数据存储出错"
							});
						}
						return res.send({
							success:true
						});
					});

				});
			}else{
				//非当日
				CounterService.init(today,function(err){
					if(err){
						return res.send({
							success:false,
							msg:"数据存储出错"
						});
					}
					CounterService.getSeqID(today, function (err,seqId) {
						if(err){
							return res.send({
								success:false,
								msg:"数据存储出错"
							});
						}

						//seqId补零
						if(parseInt(seqId) < 10){
							seqId = "00" + seqId;
						}else if(parseInt(seqId)  < 100){
							seqId = "0" + seqId
						}

						proj.basicInfo.serialno = "GC" + today + seqId;

						//保存
						EngprojService.save(proj,function (err, proj) {
							if (err) {
								return res.send({
									success:false,
									msg:"数据存储出错"
								});
							}
							return res.send({
								success:true
							});
						});

					});
				})
			}
		});

    });

    //获取项目信息
    app.post('/engineeringproj/getById',checkLogin,function(req,res){
        var id = req.body.id;
        EngprojService.getById(id,function(err,engproj){
            if(err){
                console.log(err);
                req.flash('error', err);
                res.send({engproj:null});
            }
            return res.send(engproj);
        });
    });

    //编辑项目信息
    app.post('/engineeringproj/edit',checkLogin,function(req,res){
        var proj = req.body.proj;
        EngprojService.updateOne(proj,function (err, nUpdated) {
            if (err) {
                return res.send({
                    success:false
                });
            }
            return res.send({
                success:true
            });
        });
    });

    //导出Excel
    app.get('/engineeringproj/getExcel', checkLogin , function (req, res) {
        //取出所有engprojs
        EngprojService.getAll(function (err, engprojs) {
            if (err) {
                console.log(err);
                engprojs = [];
            }
	        var data = EngprojService.getDataForExcel(engprojs);

            var buffer = xlsx.build([{name: "工程公司项目", data: data}]);

            fs.writeFile(path.join(__dirname,"../../public/excel/工程公司项目.xlsx"),buffer,function(err){
                if(err) console.log(err);
                res.download(path.join(__dirname,"../../public/excel/工程公司项目.xlsx"), function (err) {
                    if(err) console.log(err);
                });
            });

        });
    });

	//附件上传
	app.post('/engineeringproj/upload',checkLogin,function(req,res){

		//获取文件信息
		var fileInfo = req.body;

		var id = fileInfo.id;
		var file = fileInfo.fileName;
		var filename = "";

		for(_file in req.files){
			filename = req.files[_file].originalname;
		}

		EngprojService.updateUploadInfo(id,file,filename,function(err,nUpdated){
			res.type("html");
			if(err){
				console.log(err);
				return res.send({success:false});
			}else{
				return res.send({success:true,
								fileNameUploaded:filename});
			}

		});

	});

	//附件下载
	app.get('/engineeringproj/downloadAttachment',checkLogin,function(req,res){

		//获取文件信息
		console.log(req.query);

		var id = req.query.id;
		var file = req.query.file;
		var pathOfFileToDownload = path.join(__dirname,("../../public/attachment/engproj/" + id + "/" + file + "/"));


		if(fs.existsSync(pathOfFileToDownload)){
			var filesInDir = fs.readdirSync(pathOfFileToDownload);

			var fileToBeDownloaded =  path.join(pathOfFileToDownload,filesInDir[0]);

			res.download(fileToBeDownloaded);
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
var NetprojService = require('../models/services/netproj');
var CounterService = require('../models/services/counter');
var moment = require('moment');
var util = require('util');
var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');


module.exports = function (app) {

	app.get('/netproj', checkLogin, function (req, res) {
		//取出所有engprojs
		NetprojService.getAll(function (err, netprojs) {
			if (err) {
				netprojs = [];
			}
			res.render('netproj', {
				title: '网络部项目管理',
				user: req.session.user,
				netprojs: netprojs,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	//删除项目
	app.delete('/netproj', checkLogin, function (req, res) {
		var idsToDelete = req.body;
		NetprojService.deleteById(idsToDelete, function (err, nRemoved) {
			if (err) {
				console.log(err);
				req.flash('error', err);
				return res.send({success: false});
			}
			//遍历删除对应项目附件
			for (var i = 0; i < idsToDelete.length; i++) {
				fse.removeSync(path.join(__dirname, ("../../public/attachment/netproj/" + idsToDelete[i])));
			}
			return res.send({success: true});
		});
	});

	//保存项目
	app.post('/netproj/save', checkLogin, function (req, res) {
		var proj = req.body.proj;

		var today = moment().format('YYYYMMDD');

		//检查counter中日期
		CounterService.isToday(today, function (err, result) {
			if (err) {
				return res.send({
					success: false,
					msg: "数据存储出错"
				});
			}
			if (result === true) {
				//是当日
				CounterService.getSeqID(today, function (err, seqId) {
					if (err) {
						return res.send({
							success: false,
							msg: "数据存储出错"
						});
					}
					//seqId补零
					if (parseInt(seqId) < 10) {
						seqId = "00" + seqId;
					} else if (parseInt(seqId) < 100) {
						seqId = "0" + seqId
					}

					proj.basicInfo.serialno = "WL" + today + seqId;


					//保存
					NetprojService.save(proj, function (err, proj) {
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
			} else {
				//非当日
				CounterService.init(today, function (err) {
					if (err) {
						return res.send({
							success: false,
							msg: "数据存储出错"
						});
					}
					CounterService.getSeqID(today, function (err, seqId) {
						if (err) {
							return res.send({
								success: false,
								msg: "数据存储出错"
							});
						}
						//seqId补零
						if (parseInt(seqId) < 10) {
							seqId = "00" + seqId;
						} else if (parseInt(seqId) < 100) {
							seqId = "0" + seqId
						}

						proj.basicInfo.serialno = "WL" + today + seqId;


						//保存
						NetprojService.save(proj, function (err, proj) {
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
				})
			}
		});

	});

	//获取项目信息
	app.post('/netproj/getById', checkLogin, function (req, res) {
		var id = req.body.id;
		NetprojService.getById(id, function (err, netproj) {
			if (err) {
				console.log(err);
				req.flash('error', err);
				res.send({netproj: null});
			}
			return res.send(netproj);
		});
	});

	//编辑项目信息
	app.post('/netproj/edit', checkLogin, function (req, res) {
		var proj = req.body.proj;
		NetprojService.updateOne(proj, function (err, nUpdated) {
			if (err) {
				return res.send({
					success: false
				});
			}
			return res.send({
				success: true
			});
		});
	});

	//导出Excel
	app.get('/netproj/getExcel', checkLogin, function (req, res) {
		NetprojService.getAll(function (err, netprojs) {
			if (err) {
				console.log(err);
				netprojs = [];
			}

			var data = NetprojService.getDataForExcel(netprojs);

			var buffer = xlsx.build([{name: "网络部项目", data: data}]);

			fs.writeFile(path.join(__dirname, "../../public/excel/网络部项目.xlsx"), buffer, function (err) {
				if (err) console.log(err);
				res.download(path.join(__dirname, "../../public/excel/网络部项目.xlsx"), function (err) {
					if (err) console.log(err);
				});
			});

		});
	});

	//附件上传
	app.post('/netproj/upload', checkLogin, function (req, res) {

		//获取文件信息
		var fileInfo = req.body;

		var id = fileInfo.id;
		var file = fileInfo.fileName;
		var filename = "";

		for (_file in req.files) {
			filename = req.files[_file].originalname;
		}

		NetprojService.updateUploadInfo(id, file, filename, function (err, nUpdated) {
			res.type("html");
			if (err) {
				console.log(err);
				return res.send({success: false});
			} else {
				return res.send({
					success: true,
					fileNameUploaded: filename
				});
			}

		});

	});

	//附件下载
	app.get('/netproj/downloadAttachment', checkLogin, function (req, res) {

		//获取文件信息
		console.log(req.query);

		var id = req.query.id;
		var file = req.query.file;
		var pathOfFileToDownload = path.join(__dirname, ("../../public/attachment/netproj/" + id + "/" + file + "/"));


		if (fs.existsSync(pathOfFileToDownload)) {
			var filesInDir = fs.readdirSync(pathOfFileToDownload);

			var fileToBeDownloaded = path.join(pathOfFileToDownload, filesInDir[0]);

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

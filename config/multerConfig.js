var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var util = require('util');

module.exports = function(app){

    app.use(multer({ dest: (path.join(__dirname,"../public/")),

        rename: function (fieldname,filename,req,res) {
	        //上传头像
	        if(req.originalUrl === '/profile/uploadPortrait'){
		        return fieldname;
	        }

	        return filename;
        },
        changeDest: function(dest, req, res) {

	        //上传头像
            if(req.originalUrl === '/profile/uploadPortrait'){
                return dest + '/images/portrait'
            }
	        //上传附件，工程公司项目
	        if(req.originalUrl === '/engineeringproj/upload'){
		        var proj = "engproj";
		        var projId = req.body.id;
		        var file = req.body.file;
		        //若路径不存在则新建
		        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file )))){
			        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )))){
				        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )));
			        }
			        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file + '/')));
		        }else{
			        //若路径存在则清空内容
			        var filesInDir = fs.readdirSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file )));
			        for(var i = 0 ; i < filesInDir.length ; i++){
				        fs.unlinkSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file + "/" + filesInDir[i])));
			        }
		        }
		        return dest + ('/attachment/'+ proj + "/"  + projId + '/' + file)
	        }
	        //上传附件，网络部部项目
	        if(req.originalUrl === '/netproj/upload'){
		        var proj = "netproj";
		        var projId = req.body.id;
		        var file = req.body.file;
		        //若路径不存在则新建
		        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file )))){
			        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )))){
				        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )));
			        }
			        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file + '/')));
		        }else{
			        //若路径存在则清空内容
			        var filesInDir = fs.readdirSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file )));
			        for(var i = 0 ; i < filesInDir.length ; i++){
				        fs.unlinkSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file + "/" + filesInDir[i])));
			        }
		        }
		        return dest + ('/attachment/'+ proj + "/"  + projId + '/' + file)
	        }
	        //上传附件，市政项目
	        if(req.originalUrl === '/citygovproj/upload'){
		        var proj = "citygovproj";
		        var projId = req.body.id;
		        var file = req.body.file;
		        //若路径不存在则新建
		        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file )))){
			        if(!fs.existsSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )))){
				        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId )));
			        }
			        fs.mkdirSync(path.join(__dirname,("../public/attachment/" + proj + "/" + projId + '/' + file + '/')));
		        }else{
			        //若路径存在则清空内容
			        var filesInDir = fs.readdirSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file )));
			        for(var i = 0 ; i < filesInDir.length ; i++){
				        fs.unlinkSync(path.join(__dirname,("../public/attachment/"+ proj + "/"  + projId + '/' + file + "/" + filesInDir[i])));
			        }
		        }
		        return dest + ('/attachment/'+ proj + "/"  + projId + '/' + file)
	        }
	        //其他
	        return dest;

        },
        onFileUploadData: function (file, data, req, res) {

	        //上传头像
            if(req.originalUrl === '/profile/uploadPortrait'){
                var ext = path.extname(file.originalname);
                ext = ext.toLowerCase();

                //检查文件格式,若格式不正确，则删除文件，取消上传。若为正确格式的文件，同一转换成png格式。
                if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
                    if(fs.existsSync(path.join(__dirname,"../public/images/portrait/",file.name))){
                        fs.unlinkSync(path.join(__dirname,"../public/images/portrait/",file.name));
                    }
                }else{
                    var oldPath = path.join(__dirname,"../public/images/portrait/",file.name);

                    //等待文件全部上传
                    while(!fs.existsSync(oldPath)){

                    }

                    var newFileName = path.basename(file.name,ext) + '.png';
                    var newPath = path.join(__dirname,"../public/images/portrait/",newFileName);
                    fs.renameSync(oldPath,newPath);

                }

            }
        }}));
};

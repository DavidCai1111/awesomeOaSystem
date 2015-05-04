var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var dbConfig = require('./config/dbConfig');
var app = express();

mongoose.connect(('mongodb://' + dbConfig.host + ':27017/' + dbConfig.db), {
  user: dbConfig.collectionUsername,
  pass: dbConfig.collecttionPassword,
  auth: {
    user: dbConfig.dbUsername,
    pass: dbConfig.dbPassword
  }
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

//文件上传配置
require('./config/multerConfig')(app);

app.use(express.session({
  secret: dbConfig.cookieSecret,
  key: dbConfig.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30天
  store: new MongoStore({
    db: dbConfig.db
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//路由
require('./web_route')(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'));
});

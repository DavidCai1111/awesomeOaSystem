var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

//路由
var authRoutes = require('./app/controllers/auth');
var profileRoutes = require('./app/controllers/profile');
var userRoutes = require('./app/controllers/user');
var engprojRoutes = require('./app/controllers/engproj');
var netprojRoutes = require('./app/controllers/netproj');
var citygovprojRoutes = require('./app/controllers/citygovproj');

var app = express();

//链接mongodb
mongoose.connect(('mongodb://' + settings.host + ':27017/' + settings.db),{
    user:"blogAdmin",
    pass:"blogAdmin",
    auth:{
        user:"dbAdmin",
        pass:"dbAdmin"
    }
});

// all environments
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
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//使用路由
authRoutes(app);
userRoutes(app);
engprojRoutes(app);
netprojRoutes(app);
citygovprojRoutes(app);
profileRoutes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

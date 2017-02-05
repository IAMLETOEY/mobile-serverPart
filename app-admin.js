'use strict';

// 基础模块
var express = require('express');
var path = require('path');
var fs = require('fs');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// 中间件
var errorhandler = require('errorhandler'),
    FileStreamRotator = require('file-stream-rotator'),
    favicon = require('serve-favicon'),
    log4js = require('log4js'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

// 全局变量
global.__root = __dirname;
global.__host = 'http://112.74.80.83:30008';
global._ = require('underscore');
global.Promise = require('bluebird'); // 异步处理 promise
global.ProjectName = 'mobile'; // 配置项目名称
global.ProjectPath = '/src/projects/admin'; // 配置项目路径, 新项目需要配置

// 初始化程序
var app = express();

// 数据库配置
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + ProjectName + ':letoey@localhost:27017/' + ProjectName);
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function (callback) {
    console.log('open-mongoose-connect');
});
var autoIncrement = require('mongoose-auto-increment'); //自增ID 模块
autoIncrement.initialize(connection); //初始化
global.mongoose = mongoose;
global.autoIncrement = autoIncrement;

// 环境配置
app.set('port', process.env.PORT || 3000); // 端口设置
app.use(favicon(__dirname + '/public/favicon.ico')); // ico设置

// 参数解析配置
var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    // verify: rawBodySaver
}));
// parse application/json
app.use(bodyParser.json({
    limit: '50mb',
    // verify: rawBodySaver
}));
app.use(bodyParser.raw({
    verify: rawBodySaver,
    type: '*/xml'
}));

// 会话session配置
var client = redis.createClient();
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000
    },
    store: new RedisStore({
        client: client,
    }),
    secret: 'keyboard cat'
}));

// 日志配置
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logger = log4js.getLogger('connect');
log4js.configure({
    appenders: [{
        type: 'file',
        filename: __dirname + '/log/connect.log',
        maxLogSize: 1024 * 1024,
        backups: 3,
        category: 'connect'
    }]
});
app.use(log4js.connectLogger(logger, {
    level: 'auto'
}));

// 上传目录
app.use('/upload', express.static(__dirname + '/upload'));

// 静态资源配置
app.use('/', express.static(__dirname + '/src/assets'));

// 全局定时任务
require(__dirname + '/src/tasks')(app);

// 路由
require(__dirname + ProjectPath + '/routes')(app);

// 模板引擎
app.set('views', __dirname + ProjectPath + '/views');
app.set('view engine', 'ejs');

// 开发模式
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

// 服务端口
app.listen(30018);
console.log('-> admin start');

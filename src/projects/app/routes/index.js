module.exports = function(app) {
    // 用户
    require('./user/login')(app);
    require('./user/regist')(app);
    require('./user/info')(app);
    require('./user/update')(app);
    require('./user/avatar')(app);
};

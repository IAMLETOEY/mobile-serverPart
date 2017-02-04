module.exports = function(app) {
    // 用户
    require('./user/login')(app);
    require('./user/info')(app);
    require('./user/update')(app);
    require('./user/avatar')(app);
    // 选项表
    require('./option/detail')(app);
    require('./option/list')(app);
    // 企业信息
    require('./company/create')(app);
    require('./company/list')(app);
    require('./company/edit')(app);
    require('./company/detail')(app);
    require('./company/query')(app);
    require('./company/statistics')(app);
    //通知管理
    require('./message/msgList')(app);
    require('./message/msgDetail')(app);
};

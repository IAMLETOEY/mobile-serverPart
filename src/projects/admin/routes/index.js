module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/admin/login');
    });
    // 管理员登录
    require('./admin/login')(app);
    // 评判表管理
    require('./admin/option/create')(app);
    require('./admin/option/list')(app);
    require('./admin/option/edit')(app);
    require('./admin/option/operate')(app);
    // 企业管理
    require('./admin/company/create')(app);
    require('./admin/company/list')(app);
    require('./admin/company/edit')(app);
    require('./admin/company/operate')(app);
    // 用户管理
    require('./admin/user/create')(app);
    require('./admin/user/list')(app);
    require('./admin/user/edit')(app);
    require('./admin/group/create')(app);
    require('./admin/group/list')(app);
    require('./admin/group/edit')(app);
    require('./admin/group/addMember')(app);
    require('./admin/group/memberList')(app);
    //信息管理
    require('./admin/message/createMsg')(app);
    require('./admin/message/msgList')(app);
    require('./admin/message/edit')(app);
};

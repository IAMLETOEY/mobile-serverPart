module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/admin/login');
    });
    // 管理员登录
    require('./admin/login')(app);
};

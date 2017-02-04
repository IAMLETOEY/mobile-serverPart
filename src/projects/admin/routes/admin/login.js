module.exports = function (app) {
    app.get('/admin/login', function (req, res) {
        res.render('admin/login', {});
    });

    app.post('/admin/login-post', function (req, res) {

        var username = req.body.username;
        var password = req.body.password;
        if (username == 'admin' && password == 'root1010!@#') {
            loginSuccess('admin');
        } else {
            res.render('common/tips', {
                message: '管理员账号密码不正确',
                target: '/admin/login'
            });
        }

        function loginSuccess(admin) {
            var redis = require('redis');
            var client = redis.createClient();
            var sessionID = req.sessionID;
            client.set('AdminSessionID:' + sessionID, admin, function () {
            });
            client.expire('AdminSessionID:' + sessionID, 60 * 60 * 24);
            req.session.regenerate(function () {
                req.session.sessionID = sessionID;
                req.session.save(); //保存一下修改后的Session
                res.redirect('/admin/option/create');
                console.log('admin login suc:----> ' + admin, new Date());
            });
        }
    });



};

/**
 * Created by Zack on 2017/1/13.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Message = require(__root + '/src/models/Message');

module.exports = function (app) {
    app.get('/admin/message/createMsg', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            res.render('admin/message/createMsg', {});
        });

    });

    app.post('/admin/message/create', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.body;

            var createInfo = {
                title: reqData.title,
                briefIntr: reqData.briefIntr,
                content: reqData.content,
                addUser: user._id
            };
            Message.createAsync(createInfo).then(function (_message) {
                console.log('/admin/message/createMsg suc:---->', _message);
                res.render('common/tips', {
                    message: '添加成功!',
                    target: '/admin/message/msgList'
                });
            }).catch(function (err) {
                console.log('/admin/message/createMsg err:---->', err);
                res.render('common/tips', {
                    message: '添加失败',
                    target: '/admin/message/createMsg'
                });
            });

        });
    })
}
/**
 * Created by Zack on 2017/1/14.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Message = require(__root + '/src/models/Message');

module.exports = function (app) {
    var msgID = 0;
    app.get('/admin/message/edit', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.query;
            msgID = reqData.id;
            var matchMsg = {
                delFlag: 2,
                _id: reqData.id
            };
            Message.findOneAsync(matchMsg).then(function (_message) {
                console.log('/admin/message/edit getMsg----------->'+_message)
                if (_message) {
                    res.render('admin/message/edit', {
                        title: _message.title,
                        briefIntr: _message.briefIntr,
                        content: _message.content
                    });
                } else {
                    res.render('common/tips', {
                        message: '获取失败',
                        target: '/admin/message/edit'
                    });
                }
            }).catch(function (err) {
                console.log('/admin/message/edit err:---->', err);
            })

        });

    });

    app.post('/admin/message/edit-post', function (req, res) {
        var time = new Date();
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.body;
            console.log('reqData.id'+msgID);
            var updateInfo = {
                title: reqData.title,
                briefIntr: reqData.briefIntr,
                content: reqData.content,
                updUser: user._id,
                updDate: time

            };
            Message.updateAsync({
                _id: msgID,
                delFlag: 2
            }, {
                $set: updateInfo
            }).then(function (_message) {
                if (_message && _message.nModified == 0) {
                    res.render('common/tips', {
                        message: '内容重复,没有修改',
                        target: '/admin/message/msgList'
                    });
                } else {
                    console.log('/admin/message/edit suc:---->', _message);
                    res.render('common/tips', {
                        message: '修改成功!',
                        target: '/admin/message/msgList'
                    });
                }

            }).catch(function (err) {
                console.log('/admin/message/edit err:---->', err);

            });

        });
    })
}
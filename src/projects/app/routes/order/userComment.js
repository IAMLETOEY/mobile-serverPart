var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Comment = require(__root + '/src/models/Comment');

module.exports = function (app) {
    app.post('/order/addComment', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            Comment.findOneAsync({
                object: reqData.order,
                addUser: user._id,
                type: 2,
                delFlag: 2
            }).then(function (result) {
                if (result = null) {
                    return Comment.createAsync({
                        object: reqData.order,
                        content: reqData.content,
                        type: 2,
                        addUser: user._id
                    })
                } else {
                    throw 'userCommentErr - 50303'
                }
            }).then(function (result) {
                var resData = {
                    code: 200,
                    msg: '评论成功',
                    data: result
                };
                res.send(resData, resultCode.type, 200)
            }).catch(function (err) {
                console.log(err);
                if (err.indexOf('userCommentErr') > -1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return;
                }
                res.send(resultCode['50000'], resultCode.type, 200)
            })
        })
    })
};
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Comment = require(__root + '/src/models/Comment');

module.exports = function (app) {
    app.post('/phone/addComment', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            Comment.createAsync({
                object: reqData.phone,
                addUser: user._id,
                response: reqData.response ? reqData.response : 0,
                content: reqData.content,
                type: 1
            }).then(function (result) {
                var resData = {
                    code: 200,
                    msg: '评论成功',
                    data: result
                };
                res.send(resData, resultCode.type, 200)
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200)
            })
        })
    })
};
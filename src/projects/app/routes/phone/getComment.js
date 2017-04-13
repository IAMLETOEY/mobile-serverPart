var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Comment = require(__root + '/src/models/Comment');

module.exports = function (app) {
    app.post('/phone/getComment', function (req, res) {
        auth.check(req, res, function () {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            var matchComment = {
                object: reqData.phone,
                type: 1,
                delFlag: 2
            };
            var optionComment = {
                populate: {
                    path: 'response addUser',
                    select: 'nickName',
                    model: 'User'
                },
                sort: 'addDate'
            };
            Comment.findAsync(matchComment, '', optionComment).then(function (result) {
                var commentList = result;
                _.each(commentList, function (n, i) {
                    if (n.response && n.response._id > 0) {
                        n.content = '@' + n.response.nickName + '  ' + n.content
                    }
                });
                var resData = {
                    code: 200,
                    msg: '查找成功',
                    data: commentList
                };
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200);
            })
        })
    })
};
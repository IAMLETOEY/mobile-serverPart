var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');
var Comment = require(__root + '/src/models/Comment');

module.exports = function (app) {
    app.post('/phone/detail', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var matchPhone = {
                _id: reqData.phone,
                delFlag: 2
            };
            var optionPhone = {
                populate: {
                    path: 'addUser',
                    select: 'avatar nickName account',
                    model: 'User'
                }
            };
            var matchComment = {
                phone: reqData.phone,
                delFlag: 2
            };
            var optionComment = {
                populate: {
                    path: 'response',
                    select: 'nickName',
                    model: 'User'
                },
                sort: 'addDate'
            };
            var task = [];
            task.push(Phone.findOneAsync(matchPhone, '', optionPhone));
            task.push(Comment.findAsync(matchComment, '', optionComment));
            Promise.all(task).then(function (result) {
                _.each(result[1], function (n, i) {
                    if (n.response._id > 0) {
                        n.content = '@' + n.response.nickName + '  ' + n.content
                    }
                });
                var resData = {
                    code: 200,
                    msg: '查找成功',
                    data: {
                        phone: result[0],
                        comment: result[1]
                    }
                };
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200);
            })
        })
    })
};
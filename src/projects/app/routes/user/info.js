var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/user/info', function (req, res) {
        auth.check(req, res, function (user) {
            var task = [];
            task.push(User.findOneAsync({
                _id: user._id,
                delFlag: 2
            }));
            task.push(Comment.findAsync({
                object: user._id,
                type: 2,
                delFlag: 2
            }));
            Promise.all(task).then(function (result) {
                if (result) {
                    var resData = {
                        code: '200',
                        msg: 'success',
                        data: {
                            UserInfo: result[0],
                            comment: result[1]
                        }
                    };
                    res.send(resData, resultCode.type, 200);
                    console.log('/user/info suc:---->', result);
                } else {
                    console.log('/user/info no user:---->', result);
                    res.send(resultCode['50101'], resultCode.type, 200);
                }
            }).catch(function (err) {
                console.log('/user/info err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
            });
        });

    });
};

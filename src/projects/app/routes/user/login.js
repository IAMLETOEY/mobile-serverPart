var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/user/login', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (e) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        User.findOneAsync({
            account: reqData.account,
            password: reqData.password,
            delFlag: 2
        }, null, {
            select: 'account nickName type avatar'
        }).then(function (_user) {
            if (_user) {
                var redis = require('redis');
                var client = redis.createClient();
                var sessionID = req.sessionID;
                var key = 'sessionID:' + sessionID;
                client.keys('sessionID:*', function (err, keys) {
                    _.each(keys, function (key) {
                        client.get(key, function (err, reply) {
                            var user = JSON.parse(reply.toString());
                            if (user._id == _user._id) client.expire(key, 0);
                        });
                    });
                    setTimeout(function () {
                        client.set(key, JSON.stringify(_user), function () {
                        });
                        client.expire(key, 60 * 60 * 24 * 7);
                    }, 0);
                });

                var resData = {
                    code: '200',
                    msg: 'success',
                    data: {
                        sessionID: sessionID,
                        UserInfo: _user
                    }
                };
                res.send(resData, resultCode.type, 200);
            } else {
                res.send(resultCode['50101'], resultCode.type, 200);
            }
        }).catch(function (err) {
            console.log('/app/user/login err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        })
    });
};

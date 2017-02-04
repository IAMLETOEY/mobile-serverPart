var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/app/user/login.do', function (req, res) {

        try {
            var reqData = JSON.parse(req.body.data);
        } catch (e) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        User.findOneAsync({
            loginName: reqData.loginName,
            password: reqData.password,
            delFlag: 2
        }, null, {
            select: 'loginName name type avatar'
        }).then(function (_user) {
            if (_user) {
                var redis = require('redis');
                var client = redis.createClient();
                var sessionID = req.sessionID;
                var key = 'AppSessionID:' + sessionID;

                client.keys('AppSessionID:*', function (err, keys) {
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
                console.log('/app/user/login.do suc:---->', _user);
            } else {
                console.log('/app/user/login.do no user:---->', _user);
                res.send(resultCode['50101'], resultCode.type, 200);
            }
        }).catch(function (err) {
            console.log('/app/user/login.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        })

    });
};

var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/app/user/info.do', function (req, res) {

        auth.checkApp(req, res, function(user) {
            User.findOneAsync({
                _id: user._id,
                delFlag: 2
            }, null, {
                select: 'loginName name type avatar'
            }).then(function (_user) {
                if (_user) {
                    var resData = {
                        code: '200',
                        msg: 'success',
                        data: {
                            UserInfo: _user
                        }
                    };
                    res.send(resData, resultCode.type, 200);
                    console.log('/app/user/info.do suc:---->', _user);
                } else {
                    console.log('/app/user/info.do no user:---->', _user);
                    res.send(resultCode['50101'], resultCode.type, 200);
                }
            }).catch(function (err) {
                console.log('/app/user/info.do err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
            });
        });

    });
};

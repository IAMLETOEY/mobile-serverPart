var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/user/info', function (req, res) {
        auth.check(req, res, function (user) {
            User.findOneAsync({
                _id: user._id,
                delFlag: 2
            }).then(function (result) {
                if (result) {
                    var resData = {
                        code: '200',
                        msg: 'success',
                        data: result
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

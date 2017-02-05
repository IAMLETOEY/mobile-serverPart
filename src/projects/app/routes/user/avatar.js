var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

function fetchTradeNo() {
    return ('' + (new Date().getTime())).slice(0, 10);
}

module.exports = function (app) {
    app.post('/app/user/avatar.do', function (req, res) {

        auth.checkApp(req, res, function (user) {

            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var fs = require('fs');
            var dataBuffer = new Buffer(reqData.base64, 'base64');
            console.log(dataBuffer);
            var path = '/upload/pic/' + fetchTradeNo() + '.jpg';

            try {
                fs.writeFileSync(__root + path, dataBuffer);
            } catch (err) {
                console.log('/app/user/avatar.do fs.writeFileSync err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            User.updateAsync({
                _id: user._id
            }, {
                avatar: path
            }).then(function (result) {
                var resData = {
                    code: '200',
                    msg: 'success',
                    data: {
                        avatar: path
                    }
                };
                console.log('/app/user/avatar.do suc:---->', result);
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {

                console.log('/app/user/avatar.do err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
            });

        });

    });
};

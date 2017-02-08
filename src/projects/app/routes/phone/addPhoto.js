var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');

function fetchTradeNo() {
    return ('' + (new Date().getTime())).slice(0, 10);
}

module.exports = function (app) {
    app.post('/phone/addPhoto', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var fs = require('fs');
            var dataBuffer = new Buffer(reqData.base64, 'base64');
            console.log(dataBuffer);
            var path = '/upload/tmp/' + fetchTradeNo() + '.jpg';

            try {
                fs.writeFileSync(__root + path, dataBuffer);
            } catch (err) {
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var resData = {
                code: '200',
                msg: 'success',
                data: {
                    photo: path
                }
            };
            console.log('/phone/addPhoto suc:---->', resData);
            res.send(resData, resultCode.type, 200);
        });
    });
};

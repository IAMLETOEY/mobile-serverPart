var resultCode = require(__root + '/src/commons/resultCode');
var User = require(__root + '/src/models/User');
var Phone = require(__root + '/src/models/Phone');
var auth = require(__root + '/src/commons/auth');

function fetchTradeNo() {
    return ('' + (new Date().getTime())).slice(0, 10);
}

module.exports = function (app) {
    app.post('/phone/add', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            if (reqData.photo) {
                var fs = require('fs');
                var newPath = '/upload/pic/' + fetchTradeNo() + '.jpg';
                fs.rename(reqData.photo, newPath, function (err) {
                    if (err) {
                        console.log('文件移动失败!');
                        throw 'PhoneErr - 50200';
                    } else {
                        postData()
                    }
                }).catch(function (err) {
                    if (err.indexOf('PhoneErr') > -1) {
                        res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                        return;
                    }
                    res.send(resultCode['50000'], resultCode.type, 200)
                })
            }

            function postData() {
                Phone.createAsync({
                    model: reqData.model,
                    internal: parseInt(reqData.internal),
                    RAM: parseInt(reqData.RAM),
                    net: reqData.net,
                    color: reqData.color,
                    buyChannel: reqData.buyChannel,
                    warranty: reqData.warranty,
                    border: reqData.border,
                    screen: reqData.screen,
                    maintenance: reqData.maintenance,
                    failure: reqData.failure,
                    imputedPrice: parseInt(reqData.imputedPrice),
                    addUser: user._id,
                    photo: newPath
                }).then(function (result) {
                    console.log(result);
                    res.send(resultCode['200'], resultCode.type, 200);
                }).catch(function (err) {
                    console.log('/phone/add err:---->', err);
                    res.send(resultCode['50000'], resultCode.type, 200);
                });
            }
        })
    })
};
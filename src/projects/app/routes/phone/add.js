var resultCode = require(__root + '/src/commons/resultCode');
var User = require(__root + '/src/models/User');
var Phone = require(__root + '/src/models/Phone');
var auth = require(__root + '/src/commons/auth');

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
                addUser: user._id
            }).then(function (result) {
                console.log(result);
                res.send(resultCode['200'], resultCode.type, 200);
            }).catch(function (err) {
                console.log('/phone/add err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
            });
        })
    })
};
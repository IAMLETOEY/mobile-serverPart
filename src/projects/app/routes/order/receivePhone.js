var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');
var Order = require(__root + '/src/models/Order');
var Phone = require(__root + '/src/models/Phone');

module.exports = function (app) {
    app.post('/order/receivePhone', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            var matchOrder = {
                phone: reqData.phoneID,
                delFlag: 2
            };
            var optionOrder = {};
            if (reqData.isSure) {
                optionOrder['$set'] = {
                    status: 2
                }
            }
            if (reqData.isUpdate) {
                optionOrder['$set'] = {
                    status: 1,
                    transport: reqData.transport
                }
            }
            console.log(matchOrder);
            console.log(optionOrder);
            Order.updateAsync(matchOrder, optionOrder)
                .then(function (result) {
                    var resData = {
                        code: 200,
                        msg: '修改成功!',
                        data: result
                    };
                    res.send(resData, resultCode.type, 200)

                }).catch(function (err) {
                res.send(resultCode['50000'], resultCode.type, 200)
            });
        })
    })
};
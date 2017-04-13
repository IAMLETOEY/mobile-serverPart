var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');
var Phone = require(__root + '/src/models/Phone');
var Order = require(__root + '/src/models/Order');

module.exports = function (app) {
    app.post('/order/buyPhone', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            Phone.findOneAsync({
                _id: reqData.phone,
                delFlag: 2
            }).then(function (result) {
                if (result.isPurchased == 0) {
                    var optionOrder = {
                        phone: reqData.phone,
                        price: result.sellerPrice,
                        address: reqData.address,
                        receiver: reqData.receiver,
                        receiverPhone: reqData.receiverPhone,
                        seller: result.addUser,
                        addUser: user._id
                    };
                    var matchPhone = {
                        _id: reqData.phone
                    };
                    var optionPhone = {
                        isPurchased: 1
                    };
                    var task = [];
                    task.push(Order.createAsync(optionOrder));
                    task.push(Phone.updateAsync(matchPhone, optionPhone));
                    return Promise.all(task);
                } else {
                    throw 'OrderErr - 50300';
                }
            }).then(function (result) {
                if (result.length == 2) {
                    var resData = {
                        code: 200,
                        msg: '购买成功!',
                        data: result[0]
                    };
                    res.send(resData, resultCode.type, 200)
                } else {
                    throw 'OrderErr - 50302'
                }
            }).catch(function (err) {
                if (err.indexOf('OrderErr') > -1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return;
                }
                res.send(resultCode['50000'], resultCode.type, 200)
            });
        })
    })
};
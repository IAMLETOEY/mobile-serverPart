var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');
var Order = require(__root + '/src/models/Order');

module.exports = function (app) {
    app.post('/order/getOrderList', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            var matchOrder = {
                delFlag: 2
            };
            var optionOrder = {
                populate: {
                    path: 'phone',
                    select: 'model internal',
                    model: 'Phone'
                },
                sort: '-addDate'
            };
            if (reqData.myBuy) {
                matchOrder['addUser'] = user._id
            }
            if (reqData.mySell) {
                matchOrder['seller'] = user._id
            }
            Order.findAsync(matchOrder, '', optionOrder).then(function (result) {
                var resData = {
                    code: 200,
                    msg: '查找成功!',
                    data: result
                };
                res.send(resData, resultCode.type, 200)

            }).catch(function (err) {
                res.send(resultCode['50000'], resultCode.type, 200)
            });
        })
    })
};
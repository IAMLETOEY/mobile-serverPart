var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');
var Price = require(__root + '/src/models/Price');

module.exports = function (app) {
    app.post('/phone/imputedPrice', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            Price.findOneAsync({
                model: reqData.model,
                delFlag: 2
            }).then(function (result) {
                var basePrice = result.price;
                //价格计算
                if (reqData.maintenance != "无维修史") {
                    basePrice -= 50;
                }
                if (reqData.screen != "完好") {
                    basePrice -= 100;
                }
                if (reqData.border != "完好") {
                    basePrice -= 50;
                }
                if (reqData.warranty != "保修期内") {
                    basePrice -= 50;
                }
                if (reqData.internal > 32) {
                    basePrice += 100
                }

                var resData = {
                    code: 200,
                    msg: '估价成功',
                    data: {
                        price: basePrice
                    }
                };
                res.send(resData, resultCode.type, 200)
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 20)
            })
        })
    })
};
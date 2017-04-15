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
            var totalPrice = 0;
            var basePrice = 0;
            Price.findOneAsync({
                model: reqData.model+reqData.modelName,
                delFlag: 2
            }).then(function (result) {
                if (!result) {
                    basePrice = 1500
                } else {
                    basePrice = result.price;
                }
                //价格计算
                var matchNet = {
                    '1': -0.05,
                    '2': -0.05,
                    '3': -0.04,
                    '4': -0.02,
                    '5': 0
                };
                var matchInternal = {
                    '1': -0.05,
                    '2': 0,
                    '3': 0.05,
                    '4': 0.1
                };
                var matchRAM = {
                    '1': -0.03,
                    '2': -0.02,
                    '3': 0.03,
                    '4': 0.04,
                    '5': 0.05,
                    '6': 0.06
                };
                var matchChannel = {
                    '1': 0.05,
                    '2': 0.01,
                    '3': 0,
                    '4': -0.02
                };
                var matchBorder = {
                    '1': 0,
                    '2': -0.05
                };
                var matchScreen = {
                    '1': 0.03,
                    '2': -0.05,
                    '3': -0.02
                };
                var matchMaintenance = {
                    '1': 0.03,
                    '2': -0.05,
                    '3': -0.05
                };
                var matchWarranty = {
                    '1':0.05,
                    '2':0
                };

                var extra = matchNet[reqData.net] + matchBorder[reqData.border] + matchChannel[reqData.buyChannel]
                    + matchInternal[reqData.internal] + matchMaintenance[reqData.maintenance] + matchRAM[reqData.RAM]
                    + matchScreen[reqData.screen] + matchWarranty[reqData.warranty];

                totalPrice = Math.ceil(basePrice * (1 + extra));

                return Phone.createAsync({
                    model: reqData.model+reqData.modelName, // 手机型号
                    internal: reqData.internal, // 存储容量
                    RAM: reqData.RAM, // 内存
                    net: reqData.net, //网络制式
                    color: reqData.color, // 颜色
                    buyChannel: reqData.buyChannel, //购买渠道
                    warranty: reqData.warranty, //保修情况, 1处于保修期 2.超过保修期
                    border: reqData.border, //边框情况
                    screen: reqData.screen, // 屏幕情况
                    maintenance: reqData.maintenance, //维修情况
                    failure: reqData.failure, //故障情况
                    imputedPrice: totalPrice, //估算价格
                    addUser: user._id
                });
            }).then(function (phone) {
                var resData = {
                    code: 200,
                    msg: '估价成功',
                    data: {
                        price: totalPrice,
                        phoneID: phone._id
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
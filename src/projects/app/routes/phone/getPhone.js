var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');

module.exports = function (app) {
    app.post('/phone/getPhone', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            var matchNet = {
                '1': '移动版',
                '2': '联通版',
                '3': '电信版',
                '4': '双网通',
                '5': '全网通'
            };
            var matchInternal = {
                '1': '16G',
                '2': '32G',
                '3': '64G',
                '4': '128G'
            };
            var matchChannel = {
                '1': '国行有发票',
                '2': '国行无发票',
                '3': '水货无发票',
                '4': '大陆外行货'
            };
            var matchBorder = {
                '1': '边框完好',
                '2': '有磕碰/掉漆'
            };
            var matchScreen = {
                '1': '屏幕完好',
                '2': '屏幕有缺角/碎裂',
                '3': '屏幕有划痕'
            };
            var matchMaintenance = {
                '1': '无拆机无维修',
                '2': '主板维修',
                '3': '屏幕维修'
            };
            var matchWarranty = {
                '1': '处于保修期',
                '2': '超过保修期'
            };

            var matchPhone = {
                _id: reqData.phone,
                delFlag: 2
            };
            var optionPhone = {};
            Phone.findOneAsync(matchPhone, '', optionPhone).then(function (phone) {
                if (phone) {
                    var _phone = phone._doc;
                    _phone.internal = matchInternal[''+phone.internal]; // 存储容量
                    _phone.net = matchNet[phone.net]; //网络制式
                    _phone.buyChannel = matchChannel[phone.buyChannel]; //购买渠道
                    _phone.warranty = matchWarranty[phone.warranty]; //保修情况, 1处于保修期 2.超过保修期
                    _phone.border = matchBorder[phone.border]; //边框情况
                    _phone.screen = matchScreen[phone.screen]; // 屏幕情况
                    _phone.maintenance = matchMaintenance[phone.maintenance]; //维修情况
                    var resData = {
                        code: 200,
                        msg: '查找成功',
                        data: _phone
                    };
                } else {
                    var resData = {
                        code: 200,
                        msg: '暂无商品',
                        data: null
                    }
                }
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200);
            })
        })
    })
};
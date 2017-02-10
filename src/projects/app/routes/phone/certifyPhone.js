var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/phone/certifyPhone', function (req, res) {
        auth.check(req, res, function (user) {
            if (user.type == 2) {
                try {
                    var reqData = JSON.parse(req.body.data)
                } catch (e) {
                    console.log(e);
                    res.send(resultCode['50000'], resultCode.type, 200);
                    return;
                }
                //修改手机认证信息
                var matchPhone = {
                    _id: reqData.phone,
                    delFlag: 2
                };
                var optionPhone = {
                    updUser: user._id,
                    isCertified: 1
                };
                if (reqData.imputedPrice) {
                    optionPhone['imputedPrice'] = reqData.imputedPrice
                }
                if (reqData.warranty) {
                    optionPhone['warranty'] = reqData.warranty
                }
                if (reqData.border) {
                    optionPhone['border'] = reqData.border
                }
                if (reqData.screen) {
                    optionPhone['screen'] = reqData.screen
                }
                if (reqData.maintenance) {
                    optionPhone['maintenance'] = reqData.maintenance
                }
                if (reqData.failure) {
                    optionPhone['failure'] = reqData.failure
                }
                Phone.updateAsync(matchPhone, optionPhone).then(function (result) {
                    if (result.nModified = 1) {
                        var resData = {
                            code: 200,
                            msg: '修改成功',
                            data: result
                        };
                    } else {
                        var resData = {
                            code: 200,
                            msg: '暂无修改',
                            data: result
                        }
                    }
                    res.send(resData, resultCode.type, 200)
                }).catch(function (err) {
                    console.log(err);
                    res.send(resultCode['50000'], resultCode.type, 200)
                })
            } else {
                var resData = {
                    code: 200,
                    msg: '无权限操作！'
                };
                res.send(resData, resultCode.type, 200)
            }
        })
    })
};
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');

module.exports = function (app) {
    app.post('/phone/list', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var matchPhone = {
                isPost:1,
                delFlag: 2
            };
            var optionPhone = {
                sort: '-addDate'
            };
            if (reqData.user) {
                matchPhone['addUser'] = user._id
            }
            Phone.findAsync(matchPhone, '', optionPhone).then(function (result) {
                if (result.length > 0) {
                    var resData = {
                        code: 200,
                        msg: '查找成功',
                        data: result
                    };
                } else {
                    var resData = {
                        code: 200,
                        msg: '暂无商品',
                        data: null
                    }
                }
                console.log(resData);
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200);
            })
        })
    })
};
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone = require(__root + '/src/models/Phone');

module.exports = function (app) {
    app.post('/phone/detail', function (req, res) {
        auth.check(req, res, function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var matchPhone = {
                _id: reqData.phone,
                delFlag: 2
            };
            var optionPhone = {
                populate: {
                    path:'addUser',
                    select:'avatar nickName account',
                    model:'User'
                }
            };
            Phone.findOneAsync(matchPhone, '', optionPhone).then(function (result) {
                var resData = {
                    code: 200,
                    msg: '查找成功',
                    data: result
                };
                res.send(resData, resultCode.type, 200);
            }).catch(function (err) {
                console.log(err);
                res.send(resultCode['50000'], resultCode.type, 200);
            })
        })
    })
};
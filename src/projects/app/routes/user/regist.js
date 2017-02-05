var errorCode = require(__root + '/src/commons/resultCode');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/user/regist', function (req,res) {
        try {
            var reqData = JSON.parse(req.body.data);
            var phoneReg = /^1[0-9]{10}$/;
            var passwordReg = /^[a-zA-Z0-9]{6,15}$/;
            if (!phoneReg.test(reqData.account)) {
                res.send(errorCode['50101'], errorCode.type, 200);
                return;
            }
            if (!passwordReg.test(reqData.password)) {
                res.send(errorCode['50101'], errorCode.type, 200);
            }
        } catch (e){
            console.log(e);
            res.send(errorCode['50000'], errorCode.type, 200)
        }
    })
};
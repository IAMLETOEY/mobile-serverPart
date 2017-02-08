var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Phone =require(__root + '/src/models/Phone');

module.exports = function (app) {
    app.post('/phone/list',function (req,res) {
        auth.check(req,res,function (user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                console.log(e);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            var searchPage = reqData.page || 1;
            var pageSize = 20;

            var matchPhone = {
                delFlag:2
            };
            var optionPhone = {
              select: ''
            }
        })
    })
}
var resultCode = require(__root + '/src/commons/resultCode');
var Price = require(__root + '/src/models/Price');

module.exports = function (app) {
    app.post('/addSomething/addPrice', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (e) {
            console.log(e);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }
        Price.insertManyAsync(reqData).then(function (result) {
            var resData = {
                code: 200,
                msg: '新建价格信息成功',
                data: result
            };
            res.send(resData, resultCode.type, 200)
        }).catch(function (err) {
            console.log(err);
            res.send(resultCode['50000'], resultCode.type, 200)
        })
    });
};
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.post('/app/option/detail.do', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/option/detail.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        if (!reqData.id) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        Option.findOneAsync({
            _id: reqData.id,
            delFlag: 2
        }, 'name table').then(function (_option) {
            var resData = {
                code: 200,
                msg: 'success',
                data: _option
            };
            res.send(resData, resultCode.type, 200);
            console.log('/app/option/detail.do Option.findOne suc:---->', _option);
        }).catch(function (err) {
            console.log('/app/option/detail.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });

    });
};

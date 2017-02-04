var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/detail.do', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/company/detail.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        if (!reqData.id) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        Company.findOneAsync({
            _id: reqData.id,
            delFlag: 2
        }, 'name table').then(function (_option) {
            var resData = {
                code: 200,
                msg: 'success',
                data: _option
            };
            res.send(resData, resultCode.type, 200);
            console.log('/app/company/detail.do Company.findOne suc:---->', _option);
        }).catch(function (err) {
            console.log('/app/company/detail.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });

    });
};

var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/create.do', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/company/create.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        if (!reqData.table || !reqData.option) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        Company.createAsync(reqData).then(function (_company) {
            var resData = {
                code: 200,
                msg: 'success',
                data: _company
            };
            res.send(resData, resultCode.type, 200);
            console.log('/app/company/create.do Company.create suc:---->', _company);
        }).catch(function (err) {
            console.log('/app/company/create.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });
    });
};

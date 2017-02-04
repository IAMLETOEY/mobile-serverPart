var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/edit.do', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/company/edit.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        if (!reqData.id || !reqData.table || !reqData.option) {
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        Company.updateAsync({
            _id: reqData.id
        }, {
            table: reqData.table,
            option: reqData.option
        }).then(function (result) {
            var resData = {
                code: 200,
                msg: 'success',
                data: result
            };
            res.send(resData, resultCode.type, 200);
            console.log('/app/company/edit.do Company.update suc:---->', result);
        }).catch(function (err) {
            console.log('/app/company/edit.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });
    });
};

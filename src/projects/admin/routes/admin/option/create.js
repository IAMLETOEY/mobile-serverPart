var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.get('/admin/option/create', function (req, res) {

        auth.checkAdmin(req, res, function (user) {
            res.render('admin/option/create', {});
        });

    });

    app.post('/admin/option/create', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.body;
            try{
                reqData.table = JSON.parse(reqData.table);
            }catch (err){
                console.log('/admin/option/create JSON.parse err:---->', err);
            }

            Option.createAsync(reqData).then(function (_option) {
                console.log('/admin/option/create suc:---->', _option);
                res.render('common/tips', {
                    message: '添加成功!',
                    target: '/admin/option/list'
                });
            }).catch(function (err) {
                console.log('/admin/option/create err:---->', err);
                res.render('common/tips', {
                    message: '添加失败',
                    target: '/admin/option/create'
                });
            });
        });

    });
};

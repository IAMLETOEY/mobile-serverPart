var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.get('/admin/option/edit', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            if (!reqData.id) {
                res.render('common/tips', {
                    message: '评判表ID不能为空',
                    target: '/admin/option/list'
                });
                return;
            }
            Option.findOneAsync({
                _id: reqData.id
            }).then(function (_option) {
                res.render('admin/option/edit', {
                    option: _option
                });
            }).catch(function (err) {
                console.log('/admin/option/edit find err:---->', err);
            });

        });

    });

    app.post('/admin/option/edit', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.body;
            var id = reqData.id;
            delete(reqData.id);
            try {
                reqData.table = JSON.parse(reqData.table);
            } catch (err) {
                console.log('/admin/option/edit JSON.parse err:---->', err);
            }

            Option.updateAsync({
                _id: id
            }, reqData).then(function (_option) {
                console.log('/admin/option/edit suc:---->', _option);
                res.render('common/tips', {
                    message: '编辑成功!',
                    target: '/admin/option/list'
                });
            }).catch(function (err) {
                console.log('/admin/option/edit err:---->', err);
                res.render('common/tips', {
                    message: '编辑失败',
                    target: '/admin/option/edit'
                });
            });

        });

    });
};

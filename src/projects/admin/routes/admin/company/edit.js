var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.get('/admin/company/edit', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            if (!reqData.id) {
                res.render('common/tips', {
                    message: '企业ID不能为空',
                    target: '/admin/company/list'
                });
                return;
            }

            Company.findOneAsync({
                _id: reqData.id
            }).then(function (_company) {
                if(_company){
                    res.render('admin/company/edit', {
                        company: _company
                    });
                }else {
                    res.render('common/tips', {
                        message: '企业不存在',
                        target: '/admin/company/list'
                    });
                }
            }).catch(function (err) {
                console.log('/admin/company/edit find err:---->', err);
            });

        });

    });

    app.post('/admin/company/edit', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.body;
            console.log(reqData.table)
            try {
                reqData.table = JSON.parse(reqData.table);
            } catch (err) {
                console.log('/admin/company/edit JSON.parse err:---->', err);
            }

            Company.updateAsync({
                _id: reqData.id
            }, {
                table: reqData.table
            }).then(function (_company) {
                console.log('/admin/company/edit suc:---->', _company);
                res.render('common/tips', {
                    message: '编辑成功!',
                    target: '/admin/company/list'
                });
            }).catch(function (err) {
                console.log('/admin/company/edit err:---->', err);
                res.render('common/tips', {
                    message: '编辑失败',
                    target: '/admin/company/edit'
                });
            });

        });

    });
};

var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.get('/admin/company/operate', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            if(!reqData.id){
                res.render('common/tips', {
                    message: '操作失败, 没有选择操作项',
                    target: '/admin/company/list'
                });
                return;
            }
            var id = [].concat(reqData.id || []);
            var updateCompany = {
                updDate: new Date(),
                updUser: user._id
            };
            // if (reqData['status']) updateCompany['status'] = reqData['status'];
            if (reqData['delFlag']) updateCompany['delFlag'] = reqData['delFlag'];

            console.log('/admin/company/operate updateCompany:---->', updateCompany);

            Company.updateAsync({
                _id: {
                    $in: id
                }
            }, updateCompany, {
                multi: true
            }).then(function (result) {
                console.log(result);
                res.render('common/tips', {
                    message: '操作成功',
                    target: '/admin/company/list'
                });
            }).catch(function (err) {
                console.log('/admin/company/operate update err:---->', err);
            });

        });

    });
};

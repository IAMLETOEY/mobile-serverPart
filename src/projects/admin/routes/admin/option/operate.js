var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.get('/admin/option/operate', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            if(!reqData.id){
                res.render('common/tips', {
                    message: '操作失败, 没有选择操作项',
                    target: '/admin/option/list'
                });
                return;
            }
            var id = [].concat(reqData.id || []);
            var updateOption = {
                updDate: new Date(),
                updUser: user._id
            };
            // if (reqData['status']) updateOption['status'] = reqData['status'];
            if (reqData['delFlag']) updateOption['delFlag'] = reqData['delFlag'];

            console.log('/admin/option/operate updateOption:---->', updateOption);

            Option.updateAsync({
                _id: {
                    $in: id
                }
            }, updateOption, {
                multi: true
            }).then(function (result) {
                console.log(result);
                res.render('common/tips', {
                    message: '操作成功',
                    target: '/admin/option/list'
                });
            }).catch(function (err) {
                console.log('/admin/option/operate update err:---->', err);
            });

        });

    });
};

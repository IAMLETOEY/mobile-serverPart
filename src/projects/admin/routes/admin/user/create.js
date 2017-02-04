var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/user/create', function (req, res) {

        var matchGroup = {
            delFlag: 2
        };
        var optionGroup = {
            sort: '_id'
        };
        var task = [];
        task.push(Group.findAsync(matchGroup, '', optionGroup));
        Promise.all(task).then(function (result) {
            Vue.render({
                template: '/admin/user/create-group-V.html',
                data: {list: result[0].slice(1)}
            }, function (group) {
                console.log(group);
                res.render('admin/user/create', {
                    group: group
                });
            });
        });
    });

    app.post('/admin/user/create', function (req, res) {
        var reqData = req.body;
        var group = [].concat(reqData.group ? reqData.group: []);
        delete(reqData['group']);
        User.createAsync(reqData).then(function (_user) {
            console.log('/admin/user/create User.create suc:---->', _user);
            var addUser = [{
                data: {
                    user: _user._id,
                    group: 0
                }
            }];
            if (group.length) {
                _.each(group, function (item, index) {
                    addUser.push({
                        data: {
                            group: parseInt(item),
                            user: _user._id
                        }
                    });
                });
            }
            return Transaction.insertManyAsync(addUser);
        }).then(function (_transaction) {
            if (_transaction) {
                console.log('/admin/user/create Transaction.create suc:---->', _transaction);
            }
            res.render('common/tips', {
                message: '用户新建成功',
                target: '/admin/user/list'
            });
        }).catch(function (err) {
            console.log('/admin/user/create create err:---->', err);
        });
    });

};

var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/group/create', function (req, res) {
        var task = [];
        var matchUser = {
            _id:{$gt:0},
            delFlag: 2
        };
        var optionUser = {
            select: '',
            sort: '_id'
        };
        task.push(User.findAsync(matchUser, '', optionUser));
        Promise.all(task).then(function (result) {
            Vue.render({
                template: '/admin/group/create-user-V.html',
                data: {list: result[0]}
            }, function (group) {
                res.render('admin/group/create', {
                    group: group
                });
            })
        }).catch(function (err) {
            console.log(err);
        });
    });
    app.post('/admin/group/create', function (req, res) {
        var reqData = req.body;
        var leaderList = [].concat(reqData.leader ? reqData.leader: []);
        delete(reqData['leader']);
        Group.createAsync(reqData).then(function (_group) {
            console.log('/admin/group/create Group.create suc:---->', _group);
            var addGroup = [{
                data: {
                    user: 0,
                    group: _group._id
                }
            }];
            _.each(leaderList, function (item, index) {
                addGroup.push({
                    data: {
                        user: parseInt(item),
                        group: _group._id
                    },
                    isLeader:1
                });
            });
            return Transaction.insertManyAsync(addGroup);

        }).then(function (_transaction) {
            console.log('/admin/group/create Transaction.create suc:---->', _transaction);
            res.render('common/tips', {
                message: '分组新建成功',
                target: '/admin/group/list'
            });
        }).catch(function (err) {
            console.log('/admin/group/create create err:---->', err);
        });
    });
};
var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/user/edit', function (req, res) {
        var reqData = req.query;
        reqData.userID = parseInt(reqData._id);
        var matchGroup = {
            _id: {
                $gt: 1
            },
            delFlag: 2
        };
        var optionGroup = {
            sort: '_id'
        };

        //取分组名
        var actionList = [{
            "$match": {
                "data.user": reqData.userID,
                "delFlag": 2
            }
        }, {
            "$project": {
                user: "$data.user",
                group: "$data.group"
            }
        }, {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        }, {
            $lookup: {
                from: "groups",
                localField: "group",
                foreignField: "_id",
                as: "group"
            }
        }, {
            $unwind: {
                path: "$user"
            }
        }, {
            $unwind: {
                path: "$group"
            }
        }, {
            "$project": {
                "user": {
                    _id: "$user._id",
                    name: "$user.name",
                    loginName: "$user.loginName",
                    password: "$user.password",
                    type: "$user.type"
                },
                "group": {
                    _id: "$group._id",
                    name: "$group.name"
                }
            }
        }, {
            $group: {
                _id: "$user._id",
                user: {
                    $first: "$user"
                },
                group: {
                    $push: "$group"
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                "user._id": 1
            }
        }];

        var task = [];
        task.push(Group.findAsync(matchGroup, '', optionGroup));
        task.push(Transaction.aggregateAsync(actionList));
        Promise.all(task).then(function (result) {
            var groupList = [];
            _.each(result[1][0].group, function (item, index) {
                groupList.push(item._id)
            });

            Vue.render({
                template: '/admin/user/edit-type-V.html',
                data: {type: result[1][0].user.type}
            }, function (type) {
                Vue.render({
                    template: '/admin/user/edit-group-V.html',
                    data: {list: result[0], selected: groupList}
                }, function (group) {
                    res.render('admin/user/edit', {
                        oldData: result[1][0].user,
                        type: type,
                        group: group
                    });
                });
            });
        });
    });

    app.post('/admin/user/edit', function (req, res) {
        var reqData = req.body;
        console.log('groupList',reqData.group ? reqData.group : []);
        reqData.group = [].concat(reqData.group ? reqData.group : []);
        var groupList = [];
        _.each(reqData.group, function (item, index) {
            groupList.push(parseInt(item))
        });
        delete(reqData['group']);
        User.updateAsync({
            _id: parseInt(reqData._id)
        }, reqData, {multi: true}).then(function () {
            return Transaction.updateAsync({
                'data.user': parseInt(reqData._id),
                'data.group':{$gt:0},
                delFlag: 2
            }, {
                $set: {
                    delFlag: 1
                }
            }, {
                multi: true
            })
        }).then(function (result) {
            var editUser = [];
            if (groupList.length) {
                _.each(groupList, function (item, index) {
                    editUser.push({
                        data: {
                            user: parseInt(reqData._id),
                            group: item
                        }
                    })
                });
            }
            if(editUser.length){
                return Transaction.insertManyAsync(editUser);
            }
        }).then(function (doc) {
            res.render('common/tips', {
                message: '用户修改成功',
                target: '/admin/user/list'
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
};

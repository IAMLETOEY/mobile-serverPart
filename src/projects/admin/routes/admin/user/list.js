var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/user/list', function (req, res) {
        var reqData = req.query;
        var searchPage = reqData.page || 1;
        var pageSize = 20;

        var actionList = [{
            "$match": {
                "data.user":{$gt:0},
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
        }, {
            $limit: pageSize
        }, {
            $skip: pageSize * (searchPage - 1)
        }];

        if (reqData.name) {
            actionList.splice(6, 0, {
                $match: {
                    "user.name": new RegExp(reqData.name, 'i')
                }
            })
        }
        if (reqData.type) {
            actionList.splice(6, 0, {
                $match: {
                    "user.type": parseInt(reqData.type)
                }
            })
        }
        Transaction.aggregateAsync(actionList).then(function (result) {
            Vue.render({
                template: '/admin/user/list-V.html',
                data: {list: result},
                filters: {
                    transGroup: function (group) {
                        if (group.length == 1) return '暂无分组';
                        var str = [];
                        _.each(group, function (item, index) {
                            if (item._id > 999) str.push(item.name);
                        });
                        return str.join(',');
                    }
                }
            }, function (table) {
                var totalCount = result.length;
                res.render('admin/user/list', {
                    table: table,
                    totalCount: totalCount,
                    currentPage: searchPage,
                    totalPages: Math.ceil(totalCount / pageSize)
                });
            });
        });
    });

    app.post('/admin/user/list-Del', function (req, res) {
        var reqData = req.body;
        var tempList = [].concat(reqData.userID ? reqData.userID: []);
        var userList = [];
        if (tempList.length > 0) {
            _.each(tempList, function (item, index) {
                userList.push(parseInt(item))
            });
            var matchUser = {
                _id: {
                    $in: userList
                },
                delFlag: 2
            };
            var optionUser = {
                $set: {
                    delFlag: 1
                }
            };
            var matchTransaction = {
                'data.user': {
                    $in: userList
                },
                delFlag: 2
            };
            var optionTransaction = {
                $set: {
                    delFlag: 1
                }
            };
            var task = [];
            task.push(User.updateAsync(matchUser, optionUser, {multi: true}));
            task.push(Transaction.updateAsync(matchTransaction, optionTransaction, {multi: true}));
            Promise.all(task).then(function (doc) {
                if (doc) {
                    res.render('common/tips', {
                        message: '用户删除成功',
                        target: '/admin/user/list'
                    });
                }
            })
        } else {
            res.render('common/tips', {
                message: '尚未选择用户!',
                target: '/admin/user/list'
            });
        }
    });

    app.get('/admin/user/list-DelOne', function (req, res) {
        var reqData = req.query;
        reqData.userID = parseInt(reqData.userID);
        var matchUser = {
            _id: reqData.userID,
            delFlag: 2
        };
        var optionUser = {
            $set: {
                delFlag: 1
            }
        };
        var matchTransaction = {
            'data.user': reqData.userID,
            delFlag: 2
        };
        var optionTransaction = {
            $set: {
                delFlag: 1
            }
        };
        var task = [];
        task.push(User.updateAsync(matchUser, optionUser));
        task.push(Transaction.updateAsync(matchTransaction, optionTransaction, {multi: true}));
        Promise.all(task).then(function (doc) {

            if (doc) {
                res.render('common/tips', {
                    message: '用户删除成功',
                    target: '/admin/user/list'
                });
            }
        }).catch(function (err) {
            console.log(err);
        })
    })

};



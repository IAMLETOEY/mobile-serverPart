var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/group/list', function (req, res) {
        var reqData = req.query;
        var searchPage = reqData.page || 1;
        var pageSize = 20;

        var actionList = [{
            "$match": {
                "data.user":{$gt:0},
                "data.group": {$gt: 0},
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
                    name: "$user.name"
                },
                "group": {
                    _id: "$group._id",
                    name: "$group.name",
                    text: "$group.text"
                }
            }
        }, {
            $group: {
                _id: "$group._id",
                group: {
                    $first: "$group"
                },
                user: {
                    $push: "$user"
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                "group._id": 1
            }
        }, {
            $limit: pageSize
        }, {
            $skip: pageSize * (searchPage - 1)
        }];

        if (reqData.name) {
            actionList.splice(6, 0, {
                $match: {
                    "group.name": new RegExp(reqData.name, 'i')
                }
            })
        }
        Transaction.aggregateAsync(actionList).then(function (result) {
            Vue.render({
                template: '/admin/group/list-V.html',
                data: {list: result}
            }, function (table) {
                var totalCount = result.length;
                res.render('admin/group/list', {
                    table: table,
                    totalCount: totalCount,
                    currentPage: searchPage,
                    totalPages: Math.ceil(totalCount / pageSize)
                });
            });
        }).catch(function (err) {
            console.log(err);
        })
    });

    app.post('/admin/group/list-Del', function (req, res) {
        var reqData = req.body;
        var tempList = [].concat(reqData.groupID ? reqData.groupID : []);
        var groupList = [];
        if (tempList.length > 0) {
            _.each(tempList, function (item, index) {
                groupList.push(parseInt(item))
            });

            var matchGroup = {
                _id: {
                    $in: groupList
                },
                delFlag: 2
            };
            var optionGroup = {
                $set: {
                    delFlag: 1
                }
            };
            var matchTransaction = {
                'data.group': {
                    $in: groupList
                },
                delFlag: 2
            };
            var optionTransaction = {
                $set: {
                    delFlag: 1
                }
            };
            var task = [];
            task.push(Group.updateAsync(matchGroup, optionGroup, {multi: true}));
            task.push(Transaction.updateAsync(matchTransaction, optionTransaction, {multi: true}));
            Promise.all(task).then(function (doc) {
                res.render('common/tips', {
                    message: '分组删除成功',
                    target: '/admin/group/list'
                });
            })
        }
        res.render('common/tips', {
            message: '分组删除成功',
            target: '/admin/group/list'
        });
    });

    app.get('/admin/group/list-DelOne', function (req, res) {
        var reqData = req.query;
        reqData.groupID = parseInt(reqData.groupID);

        var matchGroup = {
            _id: reqData.groupID,
            delFlag: 2
        };
        var optionGroup = {
            $set: {
                delFlag: 1
            }
        };
        var matchTransaction = {
            'data.user': reqData.groupID,
            delFlag: 2
        };
        var optionTransaction = {
            $set: {
                delFlag: 1
            }
        };
        var task = [];
        task.push(Group.updateAsync(matchGroup, optionGroup, {multi: true}));
        task.push(Transaction.updateAsync(matchTransaction, optionTransaction, {multi: true}));
        Promise.all(task).then(function (doc) {
            res.render('common/tips', {
                message: '分组删除成功',
                target: '/admin/group/list'
            });
        })
    })
};
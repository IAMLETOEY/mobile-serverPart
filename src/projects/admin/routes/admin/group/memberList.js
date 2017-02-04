var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/group/memberList', function (req, res) {
        var reqData = req.query;
        var groupName = '';
        var searchPage = reqData.page || 1;
        var pageSize = 20;
        //取所有存在于该组的用户
        var actionList = [{
            "$match": {
                "data.user": {$gt: 0},
                "data.group": parseInt(reqData.groupID),
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
        Group.findOneAsync({
            _id: parseInt(reqData.groupID)
        }).then(function (group) {
            groupName = group.name;
            return Transaction.aggregateAsync(actionList)
        }).then(function (result) {
            Vue.render({
                template: '/admin/group/memberList-V.html',
                data: {list: result, groupName: groupName}
            }, function (table) {
                var totalCount = result.length;
                res.render('admin/group/memberList', {
                    table: table,
                    totalCount: totalCount,
                    currentPage: searchPage,
                    totalPages: Math.ceil(totalCount / pageSize),
                    groupID: parseInt(reqData.groupID)
                });
            });
        }).catch(function (err) {
            console.log(err);
        })
    });
    app.post('/admin/group/memberList', function (req, res) {
        var reqData = req.body;
        reqData.groupID = parseInt(reqData.groupID);
        var tempList = [].concat(reqData.member ? reqData.member : []);
        var userList = [];
        if (tempList.length > 0) {
            _.each(tempList, function (item, index) {
                userList.push(parseInt(item))
            });
            var matchTransaction = {
                'data.user': {
                    $in: userList
                },
                'data.group': reqData.groupID,
                delFlag: 2
            };
            var optionTransaction = {
                $set: {
                    delFlag: 1
                }
            };
            Transaction.updateAsync(matchTransaction, optionTransaction, {multi: true}).then(function (result) {
                res.render('common/tips', {
                    message: '组员删除成功',
                    target: '/admin/group/memberList?groupID=' + reqData.groupID
                });
            }).catch(function (err) {
                console.log(err);
            })
        } else {
            res.render('common/tips', {
                message: '尚未选择用户!',
                target: '/admin/group/memberList?groupID=' + reqData.groupID
            });
        }
    });
};
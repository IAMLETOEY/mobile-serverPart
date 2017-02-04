var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/group/addMember', function (req, res) {
        var reqData = req.query;
        var searchPage = reqData.page || 1;
        var pageSize = 20;
        reqData.groupID = parseInt(reqData.groupID);
        var actionList = [{
            "$match": {
                "data.user": {$gt: 0},
                "$and": [{"data.group": {$ne: reqData.groupID}}, {"data.group": {$ne: 0}}],
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

        Transaction.aggregateAsync(actionList).then(function (result) {
            Vue.render({
                template: '/admin/group/addMember-userList-V.html',
                data: {list: result}
            }, function (table) {
                var totalCount = result.length;
                res.render('admin/group/addMember', {
                    table: table,
                    totalCount: totalCount,
                    currentPage: searchPage,
                    totalPages: Math.ceil(totalCount / pageSize),
                    groupID: reqData.groupID
                });
            });
        }).catch(function (err) {
            console.log(err);
        })
    });
    app.post('/admin/group/addMember', function (req, res) {
        var reqData = req.body;
        var addUser = [];
        reqData.member = [].concat(reqData.member);
        _.each(reqData.member, function (item, index) {
            addUser.push({
                data: {
                    user: parseInt(item),
                    group: parseInt(reqData.groupID)
                }
            })
        });
        Transaction.insertManyAsync(addUser).then(function (_transaction) {
            console.log('/admin/group/addMember Transaction.create suc:---->', _transaction);
            res.render('common/tips', {
                message: '成员添加成功',
                target: '/admin/group/list'
            });
        }).catch(function (err) {
            console.log('/admin/group/addMember create err:---->', err);
        });
    });
};



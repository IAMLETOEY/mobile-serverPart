var User = require(__root + '/src/models/User');
var Group = require(__root + '/src/models/Group');
var Vue = require(__root + '/src/commons/vueServer');
var Transaction = require(__root + '/src/models/Transaction');

module.exports = function (app) {
    app.get('/admin/group/edit', function (req, res) {
        var reqData = req.query;
        reqData._id = parseInt(reqData._id);

        var matchUser = {
            _id: {$gt: 0},
            delFlag: 2
        };
        var optionUser = {
            select: '',
            sort: '_id'
        };

        var actionList = [{
            "$match": {
                "data.group": reqData._id,
                "data.user": {$gt: 0},
                "isLeader": 1,
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
                    leaderPower: "$group.leaderPower",
                    memberPower: "$group.memberPower",
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
                "user._id": 1
            }
        }];

        var task = [];
        task.push(User.findAsync(matchUser, '', optionUser));
        task.push(Transaction.aggregateAsync(actionList));
        Promise.all(task).then(function (result) {
            //list数组
            var list = [{code: 1, title: '查看'}, {code: 2, title: '新建'}, {code: 3, title: '修改'}, {
                code: 4,
                title: '删除'
            }, {code: 5, title: '打印'}, {code: 6, title: '修改报告编号'}, {code: 7, title: '查看附件'}, {
                code: 8,
                title: '上传附件'
            }, {code: 9, title: '删除附件'}];
            var leaderPowerList = [];
            var memberPowerList = [];
            _.each(result[1][0].group.leaderPower, function (item, index) {
                leaderPowerList.push(parseInt(item));
            });
            _.each(result[1][0].group.memberPower, function (item, index) {
                memberPowerList.push(parseInt(item));
            });
            var oldLeader = [];
            _.each(result[1][0].user, function (item, index) {
                oldLeader.push(parseInt(item._id))
            });
            Vue.render({
                template: '/admin/group/create-user-V.html',
                data: {list: result[0], oldLeader: oldLeader}
            }, function (leader) {
                Vue.render({
                    template: '/admin/group/edit-member-V.html',
                    data: {memberPower: memberPowerList, list: list}
                }, function (memberPower) {
                    Vue.render({
                        template: '/admin/group/edit-leader-V.html',
                        data: {leaderPower: leaderPowerList, list: list}
                    }, function (leaderPower) {
                        res.render('admin/group/edit', {
                            oldData: result[1][0].group,
                            leader: leader,
                            leaderPower: leaderPower,
                            memberPower: memberPower
                        });
                    })
                })
            })
        }).catch(function (err) {
            console.log(err);
        });
    });
    app.post('/admin/group/edit', function (req, res) {
        var reqData = req.body;
        reqData._id = parseInt(reqData._id);
        reqData.leader = [].concat(reqData.leader ? reqData.leader : []);
        var leaderList = [];
        _.each(reqData.leader, function (item, index) {
            leaderList.push(parseInt(item))
        });
        delete(reqData['leader']);

        var matchGroup = {
            _id: reqData._id,
            delFlag: 2
        };

        var matchLeader = {
            'data.group':reqData._id,
            'data.user':{$gt:0},
            isLeader:1,
            delFlag:2
        };
        var willLeader = {
            'data.group':reqData._id,
            'data.user':{$in:leaderList},
            delFlag:2
        };

        var optionLeader ={
            $set:{
                delFlag:1
            }
        };

        var task = [];
        task.push(Group.updateAsync(matchGroup, reqData, {multi: true}));
        task.push(Transaction.updateAsync(matchLeader,optionLeader,{multi:true}));
        task.push(Transaction.updateAsync(willLeader,optionLeader,{multi:true}));
        Promise.all(task).then(function (result) {
            var editGroup = [];
            _.each(leaderList, function (item, index) {
                editGroup.push({
                    data: {
                        user: item,
                        group: parseInt(reqData._id)
                    },
                    isLeader: 1
                })
            });
            return Transaction.insertManyAsync(editGroup)
        }).then(function (result) {
            res.render('common/tips', {
                message: '分组修改成功',
                target: '/admin/group/list'
            });
        }).catch(function (err) {
            console.log(err);
        })
    });
};
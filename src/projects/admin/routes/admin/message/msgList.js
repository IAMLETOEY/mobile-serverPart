/**
 * Created by Zack on 2017/1/13.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Vue = require(__root + '/src/commons/vueServer');
var Message = require(__root + '/src/models/Message');

module.exports = function (app) {
    app.get('/admin/message/msgList', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.query;
            var searchPage = reqData.page || 1;
            var task = [];
            var pageSize = 20;

            var matchMsg = {
                delFlag: 2
            };
            var optionMsg = {
                select: '',
                sort: '-addDate',
                limit: pageSize,
                skip: pageSize * (searchPage - 1)
            };
            if (reqData.startTime) matchMsg['addDate'] = _.extend({}, matchMsg['addDate'], {"$gt": reqData.startTime});
            if (reqData.endTime) matchMsg['addDate'] = _.extend({}, matchMsg['addDate'], {"$lt": reqData.endTime});
            if (reqData.title)  matchMsg['title'] = new RegExp(reqData.title, 'i');
            console.log('/admin/message/msgList find match:---->', matchMsg + '----------');

            var task = [];
            task.push(Message.findAsync(matchMsg, '', optionMsg));
            task.push(Message.countAsync(matchMsg));

            Promise.all(task).then(function (result) {
                var totalCount = result[1];
                console.log('result[0]------------->' + result[0]);
                Vue.render({
                    template: '/admin/message/msgList-table-V.html',
                    data: {
                        list: result[0]
                    },
                    filters: {
                        transDate: function (date) {
                            var time = new Date(date);
                            var time1 = time.setHours(time.getHours() + 8);
                            return new Date(time1).Format('yyyy-MM-dd hh:mm:ss');
                        }
                    }
                }, function (table) {
                    res.render('admin/message/msgList', {
                        startTime: reqData.startTime || '',
                        endTime: reqData.endTime || '',
                        title: reqData.title || '',
                        table: table,
                        totalCount: totalCount,
                        currentPage: searchPage,
                        totalPages: Math.ceil(totalCount / pageSize)
                    });
                });
            }).catch(function (err) {
                console.log('/admin/message/msgList table find:---->', err);
            })

        });
    });
    app.get('/admin/message/Del-one', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.query;
            Message.updateAsync({
                _id: reqData.id,
            }, {
                $set: {
                    delFlag: 1
                }
            }).then(function (doc) {
                res.render('common/tips', {
                    message: '删除成功',
                    target: '/admin/message/msgList'
                });
            }).catch(function (err) {
                console.log('/admin/message/msgList del-one:---->', err);
            });
        });
    });
    app.post('/admin/message/del-group', function (req, res) {
        auth.checkAdmin(req, res, function (user) {
            var reqData = req.body;
            if (reqData) {
                var msgList = reqData.msgID;
                var resdata = [];
                if (typeof msgList == 'string') {
                    resdata.push(parseInt(msgList));
                    // console.log(Object.prototype.toString.call(resdata)+':'+resdata[0]);
                } else {
                    console.log('length---' + msgList.length)
                    for (var i = 0; i < msgList.length; i++) {
                        console.log('msgList----->' + typeof msgList[i])
                        resdata.push(parseInt(msgList[i]));
                    }
                }
                console.log('resdata----->' + resdata + '::' + Object.prototype.toString.call(resdata));
                Message.updateAsync({
                    _id: {
                        $in: resdata
                    }
                }, { 
                    $set: {
                        delFlag: 1
                    }
                }, {multi: true}).then(function (doc) {
                    console.log(doc);
                    if (doc && doc.nModified == 0) {
                        res.render('common/tips', {
                            message: '删除失败',
                            target: '/admin/message/msgList'
                        });
                    } else {
                        res.render('common/tips', {
                            message: '删除成功',
                            target: '/admin/message/msgList'
                        });
                    }
                }).catch(function (err) {
                    console.log('/admin/message/msgList del-group:---->', err);
                })


            } else {
                console.log('/admin/message/msgList del-group:---->  没有传值');
                return;
            }
        });
    });

}
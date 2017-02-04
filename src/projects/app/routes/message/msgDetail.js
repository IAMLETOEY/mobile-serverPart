/**
 * Created by Zack on 2017/1/13.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Message = require(__root + '/src/models/Message');


module.exports = function (app) {
    app.post('/app/message/msgDetail.do', function (req, res) {
        auth.checkApp(req, res, function (user) {
            auth.checkApp(req, res, function (user) {
                try {
                    var reqData = JSON.parse(req.body.data);
                } catch (e) {
                    res.send(resultCode['50000'], resultCode.type, 200);
                    return;
                }
                var curTime = new Date();
                var findGroup = {};
                findGroup['checkGroup.' + user._id] = {$exists: true};
                var newGroup = {};
                newGroup[user._id] = {
                    'userID': user._id,
                    'addDate': curTime,
                    'delFlag': 2,
                    'upData': curTime
                };
                var setGroup = {
                    checkGroup: newGroup
                };
                var msgDetail = {};
                Message.findOneAsync({
                    _id: reqData.msgID,
                    delFlag: 2
                }).then(function (doc) {
                    console.log('doc-----------'+doc);
                    if (doc) {
                        msgDetail = {
                            title: doc.title,
                            briefIntr: doc.briefIntr,
                            content: doc.content,
                            time: doc.addDate,
                        };
                        if (!doc.checkGroup || doc.checkGroup == undefined) {
                            console.log('enter 1');
                            return Message.updateAsync({
                                _id: reqData.msgID,
                            }, {
                                $set: {
                                    'checkGroup': newGroup
                                }
                            })
                        } else {
                            console.log('enter 2');
                            var temp = doc.checkGroup;
                            temp[user._id] = newGroup;
                            if (!doc.checkGroup['user._id']) {
                                return Message.updateAsync({
                                    _id: reqData.msgID
                                }, {
                                    $set: {
                                        'checkGroup': temp
                                    }
                                });
                            }
                        }
                    }
                    else {
                        console.log(123123);
                        throw 'msgDetailErr - 50201'
                    }
                }).then(function (doc) {
                    var resData = {
                        code: 200,
                        msg: 'success',
                        data: msgDetail
                    };
                    res.send(resData, resultCode.type, 200);
                    return;
                }).catch(function (err) {
                    if (err.indexOf('msgDetailErr') > -1) {
                        res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                        return
                    }
                    console.log(err);
                    res.send(resultCode['50000'], resultCode.type, 200);
                    return
                })

            });
        })
    })
}
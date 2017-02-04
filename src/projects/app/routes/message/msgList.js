/**
 * Created by Zack on 2017/1/13.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Message = require(__root + '/src/models/Message');

module.exports = function (app) {
    app.post('/app/message/msgList.do', function (req, res) {
        auth.checkApp(req, res, function (user) {
            var matchMsg = {
                delFlag: 2
            };
            var optionMsg = {
                sort: '-addDate'
            };
            var task = Message.findAsync(matchMsg, '', optionMsg);
            Promise.all(task).then(function (doc) {
                console.log('doc-------->' + doc.length);
                if (doc.length > 0) {

                    var dataList = [];
                    _.each(doc, function (item, index) {
                        if(!item.checkGroup || item.checkGroup == undefined){
                            var msg = {
                                msgID: item._id,
                                type: item.type,
                                title: item.title,
                                briefIntr: item.briefIntr,
                                content: item.content,
                                time: item.addDate,
                                isCheck: 0
                            };
                        }
                        else {
                            if(!item.checkGroup['user_id']||item.checkGroup['user_id'] == undefined){
                                var msg = {
                                    msgID: item._id,
                                    type: item.type,
                                    title: item.title,
                                    briefIntr: item.briefIntr,
                                    content: item.content,
                                    time: item.addDate,
                                    isCheck: 0
                                };
                            } else if(item.checkGroup['user_id'] && item.checkGroup['user_id'].delFlag == 2){
                                var msg = {
                                    msgID: item._id,
                                    type: item.type,
                                    title: item.title,
                                    briefIntr: item.briefIntr,
                                    content: item.content,
                                    time: item.addDate,
                                    isCheck: 1
                                };
                            }
                        }
                        dataList.push(msg);
                    });
                    var resData = {
                        code: 200,
                        msg: 'success',
                        data: dataList,
                    };
                    res.send(resData, resultCode.type, 200);
                    return;
                } else {
                    console.log('enter------->')
                    throw 'msgErr - 50200'
                }
            }).catch(function (err) {
                if (err.indexOf('msgErr')>-1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return
                }
                res.send(resultCode['50000'], resultCode.type, 200);
                return
            });
        });
    });
}
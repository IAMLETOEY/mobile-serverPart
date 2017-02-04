/**
 * Created by Zack on 2017/1/16.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/query.do', function (req, res) {
        // auth.checkApp(req, res, function (user) {
        try {
            var reqData = JSON.parse(req.body.data);
            // console.log('companyName-------' + reqData.companyName);
        } catch (e) {
            console.log('e------->', e)
            res.send(resultCode['50000'], resultCode.type, 200);
            return
        }
        auth.checkApp(req, res, function (user) {


            var lowScore = 0;
            var highScore = 0;

            var matchQuery = {
                delFlag: 2
            };
            var optionQuery = {
                select: '_id addDate baseInfo',
                sort: '-addDate',
            };

            function score(data) {
                if (data == '优') {
                    lowScore = 90;
                    highScore = 100;
                } else if (data == '良') {
                    lowScore = 70;
                    highScore = 89;
                } else if (data == '差') {
                    lowScore = 60;
                    highScore = 69;
                } else if (data == '劣') {
                    lowScore = 0;
                    highScore = 59;
                }
            }

            var task = [];
            if (reqData.startTime) matchQuery['addDate'] = _.extend({}, matchQuery['addDate'], {"$gt": reqData.startTime});
            if (reqData.endTime) matchQuery['addDate'] = _.extend({}, matchQuery['addDate'], {"$lt": reqData.endTime});
            if (reqData.score) {
                score(reqData.score);
                matchQuery['addDate'] = _.extend({}, matchQuery['addDate'], {"$lt": reqData.endTime});
            }

            if (reqData.companyName) matchQuery['baseInfo.companyName'] = new RegExp(reqData.companyName, 'i');
            // console.log('111',matchQuery['baseInfo.companyName'])
            if (reqData.productClassify) matchQuery['baseInfo.productClassify'].productClassify = new RegExp(reqData.productClassify, 'i');
            if (reqData.policyNum) matchQuery['baseInfo.policyNum'].policyNum = new RegExp(reqData.policyNum, 'i');
            if (reqData.address) matchQuery['baseInfo.address'].address = new RegExp(reqData.address, 'i');
            if (reqData.addUser) matchQuery['addUser'] = new RegExp(reqData.addUser, 'i');
            console.log('matchQuery---------->' + JSON.stringify(matchQuery))


            Company.findAsync(matchQuery, '', optionQuery).then(function (_query) {
                console.log('_query---------->', _query);
                if (_query.length > 0) {
                    var dataList = []
                    _.each(_query, function (item, index) {
                        dataList.push({
                            id: item._id,
                            companyName: item.baseInfo.companyName,
                            date: item.addDate,

                        })
                    });
                    // console.log(33333, query);
                    var resData = {
                        code: 200,
                        msg: 'success',
                        data: dataList
                    };
                    res.send(resData, resultCode.type, 200);
                    return;
                } else {
                    console.log('enter err');
                    throw 'queryErr - 50300'
                }
            }).catch(function (err) {
                console.log('err------------->,', err);
                if (err.indexOf('queryErr') > -1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return;
                }
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            });
            // })
        });
    })
}
/**
 * Created by Zack on 2017/1/17.
 */
var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/statistics.do', function (req, res) {
        auth.checkApp(req, res, function (user) {
            var matchStatistics = {
                delFlag: 2
            };

            Company.findAsync(matchStatistics).then(function (doc) {
                console.log('doc----->', doc);
                if (doc.length > 0) {
                    var dataList = [];
                    var excellent = 0;
                    var good = 0;
                    var normal = 0;
                    var bad = 0;
                    var worst = 0;
                    _.each(doc, function (item, index) {
                        if (item.isDanger > 2) {
                            bad++;
                        }
                        else {
                            if (item.totalScore >= 90) {
                                excellent++;

                            } else if (item.totalScore >= 70 && item.totalScore < 90) {
                                good++;
                            } else if (item.totalScore >= 50 && item.totalScore < 70) {
                                normal++;
                            } else {
                                bad++;
                            }
                        }
                    });
                    var resData = {
                        code: 200,
                        msg: 'success',
                        data: {
                            excellent: excellent,
                            good: good,
                            normal: normal,
                            bad: bad
                        }
                    };
                    res.send(resData, resultCode.type, 200);
                    return;
                } else {
                    throw 'companyInfoErr - 50300'
                }
            }).catch(function (err) {
                console.log('err------->', err);
                if (err.indeOf('companyInfoErr') > -1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return;
                }

                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            })

        })
    })
}
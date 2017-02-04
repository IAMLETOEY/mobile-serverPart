var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.get('/admin/company/create', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            Option.findOneAsync({
                _id: 1000,
                delFlag: 2
            }, 'name table').then(function (_option) {
                console.log(_option);
                res.render('admin/company/create', {
                    option: _option
                });
            }).catch(function (err) {
                console.log(err)
            });

        });

    });

    app.post('/admin/company/create', function (req, res) {

        auth.checkAdmin(req, res, function (user) {


            var reqData = req.body;
            try {
                reqData.table = JSON.parse(reqData.table);
            } catch (err) {
                console.log('/admin/company/create JSON.parse err:---->', err);
            }
            var info = reqData.table[0].children;
            var baseInfo = {
                companyName: info[0].value,
                policyNum: info[1].value,
                entrustIns: info[2].value,
                address: info[3].value,
                insIndex: info[4].value,
                insAssetLocation: {
                    closestToWater: info[5].children[0].value,
                    lowerThanRoad: info[5].children[1].value,
                    closeToHill: info[5].children[2].value
                },
                buildArea: {
                    area: info[6].value,
                    howOld: info[6].value,
                    ageLimit: info[6].value
                },
                enterpriseProp: info[7].value,
                houseProp: info[8].value,
                houseFunc: info[9].value,
                productClassify: info[10].value,
                commissioning: {
                    date: info[11].children[0].value,
                    isUpdateIn3: info[11].children[1].value
                },
                staff: {
                    sum: info[12].children[0].value,
                    management: info[12].children[1].value,
                    product: info[12].children[2].value
                },
                manufactureTech: {
                    hasFire: info[13].children[0].value,
                    isHighTemp: info[13].children[1].value,
                    isElectrical: info[13].children[2].value,
                    isSpray: info[13].children[3].value,
                    isSingleSpray: info[13].children[4].value,
                    isIsolation: info[13].children[5].value,
                    dustFreePlant: info[13].children[6].value,
                    isDanger: info[13].children[7].value,
                    hasABS: info[13].children[8].value,
                    hasFPB: info[13].children[9].value,
                    hasPOM: info[13].children[10].value,
                    hasSponge: info[13].children[11].value
                },
                fireDanger: info[14].value,
                lastValue: info[15].value,
                mainMarket: info[16].value,
                manSituation: info[17].value,
                insSituation: info[18].value
            };
            var reportNum = (function () {
                var time = new Date();
                var time1 = time.setHours(time.getHours() + 8);
                var reportTime = new Date(time1).Format('yyyyMMdd');
                return 'SH-D' + reportTime + 't';
            })();
            var totalScore = 0;
            var danger = 0;
            findScore(reqData.table.slice(1, 5));


            function findScore(list) {
                _.each(list, function (item) {
                    if (item.type == 'radio' && item.value > -1) {
                        if (item.value == 2) {
                            danger++;
                        }
                        if (item.children[item.value]) {
                            if (item.children[item.value].score) {
                                totalScore += Number(item.children[item.value].score);
                            }
                        }
                    }
                    if (item.children && item.children.length > 0)  findScore(item.children);
                });
            }

            Company.createAsync({
                table: reqData.table,
                option: reqData.option_id,
                baseInfo: baseInfo,
                reportNum: reportNum,
                totalScore: totalScore,
                isDanger: danger
            }).then(function (_option) {
                console.log('/admin/company/create suc:---->', _option);
                res.render('common/tips', {
                    message: '添加成功!',
                    target: '/admin/company/list'
                });
            }).catch(function (err) {
                console.log('/admin/company/create err:---->', err);
                res.render('common/tips', {
                    message: '添加失败',
                    target: '/admin/company/create'
                });
            });
        });

    });
};

var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.post('/app/company/list.do', function (req, res) {

        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/company/list.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        var searchPage = reqData.page || 1;
        var pageSize = 20;

        // 普通列表
        var matchCompany = {
            delFlag: 2
        };
        var optionCompany = {
            select: 'option table',
            sort: '-addDate',
            limit: pageSize,
            skip: pageSize * (searchPage - 1)
        };

        // 搜索查找

        // if (reqData.company) matchCompany['company'] = new RegExp(reqData.company, 'i');
        // if (reqData.startTime) matchCompany['addDate'] = _.extend({}, matchCompany['addDate'], {"$gt": reqData.startTime});
        // if (reqData.endTime) matchCompany['addDate'] = _.extend({}, matchCompany['addDate'], {"$lt": reqData.endTime});
        console.log('/app/company/list.do find match:---->', matchCompany);

        var task = [];
        task.push(Company.findAsync(matchCompany, '', optionCompany));
        task.push(Company.countAsync(matchCompany));

        Promise.all(task).then(function (result) {
            var totalCount = result[1];
            var resData = {
                code: 200,
                msg: 'success',
                data: {
                    list: result[0],
                    totalCount: totalCount,
                    currentPage: searchPage,
                    totalPages: Math.ceil(totalCount / pageSize)
                }
            };
            res.send(resData, resultCode.type, 200);
            console.log('/app/company/list.do find suc:---->', resData);
        }).catch(function (err) {
            console.log('/app/company/list.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });

    });
};

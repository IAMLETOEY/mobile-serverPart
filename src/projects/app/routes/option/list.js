var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.post('/app/option/list.do', function (req, res) {

        try {
            var reqData = JSON.parse(req.body.data);
        } catch (err) {
            console.log('/app/option/list.do JSON.parse err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        var searchPage = reqData.page || 1;
        var pageSize = 20;

        // 普通列表
        var matchOption = {
            delFlag: 2
        };
        var optionOption = {
            select: 'name table',
            sort: '-addDate',
            limit: pageSize,
            skip: pageSize * (searchPage - 1)
        };

        // 搜索查找

        // if (reqData.company) matchOption['company'] = new RegExp(reqData.company, 'i');
        // if (reqData.startTime) matchOption['addDate'] = _.extend({}, matchOption['addDate'], {"$gt": reqData.startTime});
        // if (reqData.endTime) matchOption['addDate'] = _.extend({}, matchOption['addDate'], {"$lt": reqData.endTime});
        console.log('/app/option/list.do find match:---->', matchOption);

        var task = [];
        task.push(Option.findAsync(matchOption, '', optionOption));
        task.push(Option.countAsync(matchOption));

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
            console.log('/app/option/list.do find suc:---->', resData);
        }).catch(function (err) {
            console.log('/app/option/list.do err:---->', err);
            res.send(resultCode['50000'], resultCode.type, 200);
        });

    });
};

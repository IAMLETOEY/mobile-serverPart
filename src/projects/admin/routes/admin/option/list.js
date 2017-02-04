var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Vue = require(__root + '/src/commons/vueServer');
var Option = require(__root + '/src/models/Option');

module.exports = function (app) {
    app.get('/admin/option/list', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            var searchPage = reqData.page || 1;
            var pageSize = 20;

            // 普通列表
            var matchOption = {
                delFlag: 2
            };
            var optionOption = {
                select: '',
                sort: '-addDate',
                limit: pageSize,
                skip: pageSize * (searchPage - 1)
            };

            // 搜索查找

            // if (reqData.company) matchOption['company'] = new RegExp(reqData.company, 'i');
            // if (reqData.startTime) matchOption['addDate'] = _.extend({}, matchOption['addDate'], {"$gt": reqData.startTime});
            // if (reqData.endTime) matchOption['addDate'] = _.extend({}, matchOption['addDate'], {"$lt": reqData.endTime});
            console.log('/admin/option/list find match:---->', matchOption);

            var task = [];
            task.push(Option.findAsync(matchOption, '', optionOption));
            task.push(Option.countAsync(matchOption));

            Promise.all(task).then(function (result) {
                var totalCount = result[1];
                Vue.render({
                    template: '/admin/option/list-V.html',
                    data: {list: result[0]}
                }, function (table) {
                    res.render('admin/option/list', {
                        table: table,
                        totalCount: totalCount,
                        currentPage: searchPage,
                        totalPages: Math.ceil(totalCount / pageSize)
                    });
                });
            }).catch(function (err) {
                console.log('/admin/option/list find err:---->', err);
            });

        });

    });
};

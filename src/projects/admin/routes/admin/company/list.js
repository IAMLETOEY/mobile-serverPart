var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var Vue = require(__root + '/src/commons/vueServer');
var Company = require(__root + '/src/models/Company');

module.exports = function (app) {
    app.get('/admin/company/list', function (req, res) {

        auth.checkAdmin(req, res, function (user) {

            var reqData = req.query;
            var searchPage = reqData.page || 1;
            var pageSize = 20;

            // 普通列表
            var matchCompany = {
                delFlag: 2
            };
            var optionCompany = {
                select: '',
                sort: '-addDate',
                limit: pageSize,
                skip: pageSize * (searchPage - 1)
            };

            // 搜索查找

            // if (reqData.company) matchCompany['company'] = new RegExp(reqData.company, 'i');
            // if (reqData.startTime) matchCompany['addDate'] = _.extend({}, matchCompany['addDate'], {"$gt": reqData.startTime});
            // if (reqData.endTime) matchCompany['addDate'] = _.extend({}, matchCompany['addDate'], {"$lt": reqData.endTime});
            console.log('/admin/company/list find match:---->', matchCompany);

            var task = [];
            task.push(Company.findAsync(matchCompany, '', optionCompany));
            task.push(Company.countAsync(matchCompany));

            Promise.all(task).then(function (result) {
                var totalCount = result[1];
                console.log('result-----------',result[0][0]);
                Vue.render({
                    template: '/admin/company/list-V.html',
                    data: {list: result[0]}
                }, function (table) {

                    res.render('admin/company/list', {
                        table: table,
                        totalCount: totalCount,
                        currentPage: searchPage,
                        totalPages: Math.ceil(totalCount / pageSize)
                    });
                });
            }).catch(function (err) {
                console.log('/admin/company/list find err:---->', err);
            });

        });

    });
};

var resultCode = require(__root + '/src/commons/resultCode');
var Price = require(__root + '/src/models/Price');

module.exports = function (app) {
    app.post('/addSomething/addPrice', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
        } catch (e) {
            console.log(e);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }
        var PhoneInfo =[{
            model:'小米Note',
            price: 700
        },{
            model: '苹果5',
            price: 1200
        },{
            model: '苹果6',
            price: 2700
        },{
            model: '苹果6plus',
            price: 2000
        },{
            model: '苹果6Plus',
            price: 2000
        },{
            model: '苹果6s',
            price: 3000
        },{
            model: '苹果6S',
            price: 3000
        },{
            model: '苹果6splus',
            price: 3500
        },{
            model: '苹果6sPlus',
            price: 3500
        },{
            model: '苹果6Splus',
            price: 3500
        },{
            model: '苹果6SPlus',
            price: 3500
        },{
            model: '苹果7',
            price: 4000
        },{
            model: '魅族MX5',
            price: 1200
        },{
            model: '魅族MX6',
            price: 1300
        },{
            model: '魅族MX6PRO',
            price: 2000
        }];
        Price.insertMany(PhoneInfo).then(function (result) {
            var resData = {
                code: 200,
                msg: '新建价格信息成功',
                data: result
            };
            res.send(resData, resultCode.type, 200)
        }).catch(function (err) {
            console.log(err);
            res.send(resultCode['50000'], resultCode.type, 200)
        })
    });
};
var resultCode = require(__root + '/src/commons/resultCode');
var User = require(__root + '/src/models/User');
var redis = require('redis');
var client = redis.createClient();
module.exports = function (app) {
    app.post('/user/register', function (req, res) {
        try {
            var reqData = JSON.parse(req.body.data);
            var phoneReg = /^1[0-9]{10}$/;
            var passwordReg = /^[a-zA-Z0-9]{6,15}$/;
            if (!phoneReg.test(reqData.account)) {
                res.send(resultCode['50101'], resultCode.type, 200);
                return;
            }
            if (!passwordReg.test(reqData.password)) {
                res.send(resultCode['50101'], resultCode.type, 200);
            }
        } catch (e) {
            console.log(e);
            res.send(resultCode['50000'], resultCode.type, 200);
            return;
        }

        function createUser(reqData) {
            //检查account是否存在
            User.findOneAsync({
                account: reqData.account
            }).then(function (result) {
                //若不存在
                if (!result) {
                    return User.createAsync({
                        account: reqData.account,
                        password: reqData.password,
                        address: reqData.address,
                        sex: reqData.sex,
                        nickName: reqData.nickName,
                        idCard: parseInt(reqData.idCard),
                        type: parseInt(reqData.type)
                    })
                } else {
                    throw 'RegisterErr - 50100'
                }
            }).then(function (doc) {
                var sessionID = req.sessionID;
                client.set('sessionID:' + sessionID, doc._id, redis.print);
                client.expire('sessionID:' + sessionID, 60 * 60 * 24 * 7);
                client.keys('*', function (err, keys) {
                    console.log(keys)
                });
                req.session.regenerate(function () {
                    req.session.account = doc.account;
                    req.session.save();
                    var resData = {
                        code: '200',
                        msg: 'success',
                        data: {
                            sessionID: sessionID,
                            UserInfo: {
                                _id: doc._id,
                                account: doc.account,
                                address: doc.address,
                                sex: doc.sex,
                                nickName: doc.nickName,
                                idCard: doc.idCard,
                                type: doc.type
                            }
                        }
                    };
                    res.send(resData, resultCode.type, 200);
                })
            }).catch(function (err) {
                console.log(err);
                if (err.indexOf('RegisterErr') > -1) {
                    res.send(resultCode[err.slice(-5)], resultCode.type, 200);
                    return;
                }
                res.send(resultCode['50000'], resultCode.type, 200)
            })
        }
        createUser(reqData);
    })
};
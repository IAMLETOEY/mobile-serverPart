var resultCode = require(__root + '/src/commons/resultCode');
var redis = require('redis');
var client = redis.createClient();

var auth = {
    client: client,
    checkApp: function(req, res, callback) {
        var sessionID = req.body.sessionID;
        var key = 'AppSessionID:' + sessionID;
        client.get(key, function(err, reply) {
            if (err) {
                console.log('checkApp err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }
            if (reply) {
                var user = JSON.parse(reply.toString());
                if (typeof(callback) == 'function') callback(user);
                client.expire(key, 60 * 60 * 24 * 7);
                console.log('checkApp info:---->', req.url, user);
            } else {
                res.send(resultCode['50002'], resultCode.type, 200);
            }
        });
    },
    checkUser: function(req, res, callback) {
        var sessionID = req.session.sessionID;
        var key = 'UserSessionID:' + sessionID;
        client.get(key, function(err, reply) {
            if (err) {
                console.log('checkUser err:---->', err);
                return;
            }
            if (reply) {
                var user = JSON.parse(reply.toString());
                if (typeof(callback) == 'function') callback(user);
                client.expire(key, 60 * 60);
                req.session.regenerate(function () {
                    req.session.sessionID = sessionID;
                    req.session.save(); //保存一下修改后的Session
                });
                console.log('checkUser info:---->', req.url, user);
            } else {
                res.redirect('/user/login');
            }
        });
    },
    checkSupplier: function(req, res, callback) {
        var sessionID = req.session.sessionID;
        var key = 'SupplierSessionID:' + sessionID;
        client.get(key, function(err, reply) {
            if (err) {
                console.log('checkSupplier err:---->', err);
                return;
            }
            if (reply) {
                var user = JSON.parse(reply.toString());
                if (typeof(callback) == 'function') callback(user);
                client.expire(key, 60 * 60);
                req.session.regenerate(function () {
                    req.session.sessionID = sessionID;
                    req.session.save(); //保存一下修改后的Session
                });
                console.log('checkSupplier info:---->', req.url, user);
            } else {
                res.redirect('/supplier/login');
            }
        });
    },
    checkAdmin: function(req, res, callback) {
        callback({ _id: 0 });
        return;

        var sessionID = req.session.sessionID;
        var key = 'AdminSessionID:' + sessionID;
        client.get(key, function(err, reply) {
            if (err) {
                console.log('checkAdmin err:---->', err);
                return
            }
            if (reply) {
                var admin = reply.toString();
                if (typeof(callback) == 'function') callback(admin);
                client.expire(key, 60 * 60);
                console.log('checkAdmin info:---->', req.url, admin);
            } else {
                res.redirect('/admin/login');
            }
        });
    }
};

module.exports = auth;

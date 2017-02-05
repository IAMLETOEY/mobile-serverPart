var errorCode = require(__root + '/src/commons/resultCode');
var redis = require('redis');
var client = redis.createClient();

var auth = {
    client: client,
    check: function (req, res, callback) {
        client.keys('sessionID:' + req.body.sessionID, function (err, keys) {
            if (keys.length > 0) {
                client.get('sessionID:' + req.body.sessionID, function (err, reply) {
                    var userID = reply.toString();
                    if (typeof(callback) == 'function') callback(userID);
                });
            } else {
                res.send(errorCode['50002'], errorCode.type, 200);
            }
        })
    },
    checkAdmin: function (req, res, callback) {
        var sessionID = req.session.sessionID;
        client.keys('AdminSessionID:' + sessionID, function (err, keys) {
            if (keys.length > 0) {
                client.get('AdminSessionID:' + sessionID, function (err, reply) {
                    var admin = reply.toString();
                    if (typeof(callback) == 'function') callback(admin);
                });
            } else {
                res.redirect('/');
            }
        })
    }
};

module.exports = auth;

var resultCode = require(__root + '/src/commons/resultCode');
var auth = require(__root + '/src/commons/auth');
var User = require(__root + '/src/models/User');

module.exports = function (app) {
    app.post('/user/update', function (req, res) {

        auth.check(req, res, function(user) {
            try {
                var reqData = JSON.parse(req.body.data);
            } catch (e) {
                res.send(resultCode['50000'], resultCode.type, 200);
                return;
            }

            var update = {};
            if(reqData.nickName) update['nickName'] = reqData.nickName;
            if(reqData.address) update['address'] = reqData.address;

            User.updateAsync({
                _id: user._id,
                delFlag: 2
            }, update).then(function (result) {
                res.send(resultCode['200'], resultCode.type, 200);
                console.log('/user/update suc:---->', result);
            }).catch(function (err) {
                console.log('/user/update err:---->', err);
                res.send(resultCode['50000'], resultCode.type, 200);
            });
        });

    });
};

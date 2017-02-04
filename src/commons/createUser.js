var errorCode = require(__root + '/common/errorCode');
var Phone = require(__root + '/common/phone');
var User = require(__root + '/db/User');
var http = require('http');

var createUser = {
    create: function(reqData, callback) {

        Phone.checkAsync(reqData.phone)
            .then(function(data) {
                reqData.supplier = data.supplier;
                reqData.province = data.province;
                reqData.city = data.city;
                return User.createAsync(reqData)
            })
            .then(function(user){
                console.log(user)
                callback(null, user);
            })
            .catch(function(err) {
                callback(err, null);
            });

    },
};

Promise.promisifyAll(createUser);
module.exports = createUser;

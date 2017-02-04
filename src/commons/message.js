var errorCode = require(__root + '/common/errorCode');
var http = require('http');
var xml2js = require('xml2js');

var message = {
    send: function(opts, callback) {

        var builder = new xml2js.Builder({
            rootName: 'xml',
            headless: true,
        });
        var parser = new xml2js.Parser({
            explicitArray: false,
        });

        var phone = opts.phone;
        // phone = '15017594558'
        var msg = opts.msg;

        // var url = 'http://inter.smswang.net:7803/sms?action=send&account=000350&password=123456&mobile=' + phone + '&content=' + msg + '【中国好父母】&extno=1069032239089338';
        // console.log(url);
        try {

        	var postData = 'action=send&account=000350&password=123456&mobile=' + phone + '&content=' + msg + '【中国好父母】&extno=1069032239089338';
            console.log(postData)

            var options = {
                hostname: 'inter.smswang.net',
                port: 7803,
                path: '/sms',
                method: 'POST',                
            };

            var req = http.request(options, function(response) {

                var chunkData = null;

                response.on('data', function(chunk) {
                    chunkData = chunk;
                });
                response.on('end', function() {
                    callback && callback(null, chunkData);
                });
            });	

            req.write(postData);
            req.end();

        } catch (err) {
            callback && callback(err, null);
        }

    },
};

Promise.promisifyAll(message);
module.exports = message;

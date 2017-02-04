var errorCode = require(__root + '/common/errorCode');
var http = require('http');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');

var phone = {
    check: function(phone, callback) {

        try {
            var options = {
                host: 'life.tenpay.com',
                port: 80,
                path: '/cgi-bin/mobile/MobileQueryAttribution.cgi?chgmobile=' + phone, // 具体路径, 必须以'/'开头, 是相对于host而言的
                method: 'GET', // 请求方式
                headers: {
                    'Content-Type': 'application/xml'
                }
            };

            http.get(options, function(res) {
                var data = {};
                var bufferHelper = new BufferHelper();
                res.on("data", function(data) {
                    bufferHelper.concat(data);
                });
                res.on("end", function() {
                    var buf = bufferHelper.toBuffer();
                    var xmlData = iconv.decode(buf, 'gb2312');
                    var supplier = '';
                    var province = '';
                    var city = '';
                    var temp = xmlData.replace(/\<supplier\>(.*)\<\/supplier\>/gm, function(match, $1) {
                        supplier = $1;
                        return '';
                    });
                    temp = xmlData.replace(/\<province\>(.*)\<\/province\>/gm, function(match, $1) {
                        province = $1;
                        return '';
                    });
                    temp = xmlData.replace(/\<city\>(.*)\<\/city\>/gm, function(match, $1) {
                        city = $1;
                        return '';
                    });

                    data.supplier = supplier.trim();
                    data.province = province.trim();
                    data.city = city.trim();

                    callback(null, data);

                });
            });
        } catch (err) {
            callback(err, null);
        }

    },
};

Promise.promisifyAll(phone);
module.exports = phone;

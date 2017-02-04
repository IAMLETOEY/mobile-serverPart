var errorCode = require(__root + '/common/errorCode');
var MD5 = require(__root + '/common/md5'); // MD5('string')
var Ksort = require(__root + '/common/ksort'); // Ksort(object)
var Pay = require(__root + '/db/Pay');
var https = require('https');
var querystring = require('querystring');
var xml2js = require('xml2js');
var crypto = require('crypto');

var payAli = {
    create: function(req, res) {
        var reqIp = getClientIp(req);
        var reqBody = req.body;

        var type = reqBody.type;
        var total_fee = 30000;
        var body = '中国好父母入会充值';

        var tradeNo = fetchTradeNo(); // 内部订单号

        var orderData = {
            phone: reqBody.phone,
            name: reqBody.name,
            fromID: reqBody.fromID,
            tradeNo: tradeNo,
            totalFee: total_fee,
            type: type,
            body: body
        };

        var postData = {
            app_id: '2016071901639340',
            method: 'alipay.trade.wap.pay',
            format: 'JSON',
            return_url: 'http://www.haofumu100.com/mobi/pay_success.html',
            charset: 'utf-8',
            sign_type: 'RSA',
            timestamp: fetchTimestamp(),
            version: '1.0',
            notify_url: 'http://www.haofumu100.com/api/pay/ali_notify/' + tradeNo + '.html',
            biz_content: {
                body: body,
                subject: body,
                out_trade_no: tradeNo,
                timeout_express: '30m',
                total_amount: '300',
                product_code: 'QUICK_WAP_PAY',
                seller_id: '2088502052732835',
            }
        };

        postData.biz_content = JSON.stringify(postData.biz_content);
        postData.sign = fetchSign(postData);

        createPay(orderData, postData);

        function createPay(orderData, returnData) {
            Pay.create(orderData, function(err, node, numAffected) {
                if (err) {
                    res.send(errorCode['50001'], errorCode.type, 200);
                } else {
                    resData = {
                        code: '200',
                        msg: 'success',
                        data: returnData
                    };
                    res.send(resData, {
                        'Content-Type': 'application/json'
                    }, 200);
                }
            });
        }
    },
    sign: function(postData) {
        return fetchSign(postData);
    }
};

function getClientIp(req) {
    return
    req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

// https://doc.open.alipay.com/doc2/detail.htm?treeId=200&articleId=105351&docType=1

function fetchSign(postData) {
    var str = jsonToPostDataStr(Ksort(postData));
    var private_key = '-----BEGIN RSA PRIVATE KEY-----' + '\r\n' +
        'MIICXAIBAAKBgQCr9MectD860662gJrn7Vj3iJv8EFWKA5ty0iC9PjtB+EhCR7SF' + '\r\n' +
        'dhjJGpQgrHf4dZ0yd3e7XIXqJRgj8Q6r59L7Z5c/lHc3Xy85dEj9fIzRSMyGQotU' + '\r\n' +
        'cHQfnqx8MmuAz6v4MgGlGzskJR/aqdMGKXxwvMRFXZ6HoJmQVnIK/DmYewIDAQAB' + '\r\n' +
        'AoGAJnxmoMAG1tfB5r7p7LbGjsBYiRXuzzD3fb9h7HkdMiqroYoC8Uv5SClWtelk' + '\r\n' +
        'AIvyXvU2Kw0OO9WJjaHKMtdz9MqiC9Qmb9Wu9fVbpao1jGosFA+ZT5U0WkH4w3Wq' + '\r\n' +
        'iegsMw7fnOspbGJzrqNA93RzZApPFQ/KvtTBJt9RqDmdioECQQDft7qh4kaJEojR' + '\r\n' +
        'GsSOwjdu7Yp4qqVLGXLQLd25LN7nxv125zNzCvCLjbBtsJUnddAeAJJyHyivRFzt' + '\r\n' +
        'zrlKFZuxAkEAxMTyp0j8Wm0wdROkIKDOxfdPFGmrVQlsZkhZqqL1ofnd2E7OdVML' + '\r\n' +
        'q3EOHoqNrQPlbMtjoiDwglURVRTXVBK96wJAKQSWw3epVxh+3Vf7EfGqGDyVVupy' + '\r\n' +
        'xAI2etTuAjWn6PcjIdniJQWsdOnVn0bxEfsX3WhdcW8lFn2CTFfKwTqVAQJBAKkw' + '\r\n' +
        'azC5yfp6zmKsq8A+ZOzFlCKKJX6t5p4f8bGOA0TuEvmt8UniSTN1t109Z0pwAjJE' + '\r\n' +
        'w/ug9Qwr1wZgMDIjF1cCQAVwE3wl3Esm/n1WdY7QMtFLyQs0j182BQbCnv0azcp/' + '\r\n' +
        'R+VTV4w10IneNFyYoxmCadGyskNntV12xTRLHi10dks=' + '\r\n' +
        '-----END RSA PRIVATE KEY-----';
    var signer = crypto.createSign('RSA-SHA1');
    signer.update(str, 'utf8');
    return signer.sign(private_key, 'base64');
}

function jsonToPostDataStr(json) {
    var PostDataStr = '';
    for (var i in json) {
        PostDataStr += i + '=' + json[i] + '&';
    }
    return PostDataStr == '' ? PostDataStr : PostDataStr.slice(0, -1);
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function fetchTradeNo() {
    return (new Date()).Format("yyyyMMddhhmmssS");
}

function fetchTimestamp() {
    return (new Date()).Format("yyyy-MM-dd hh:mm:ss");
}

function fetchNonceStr() {
    return MD5(Math.random() + '');
}

module.exports = payAli;

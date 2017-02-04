var errorCode = require(__root + '/common/errorCode');
var MD5 = require(__root + '/common/md5'); // MD5('string')
var Ksort = require(__root + '/common/ksort'); // Ksort(object)
var Pay = require(__root + '/db/Pay');
var https = require('https');
var querystring = require('querystring');
var xml2js = require('xml2js');

var payWx = {
    create: function(req, res, userID) {
        var reqIp = getClientIp(req);
        var reqBody = req.body;
        var reqData = JSON.parse(req.body.data);

        var tradeNo = fetchTradeNo(); // 内部订单号

        var options = {
            host: 'api.mch.weixin.qq.com',
            port: 443,
            path: '/pay/unifiedorder',
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/xml'
            }
        };

        var postData = {
            appid: 'wxe1dea687172c442a',
            mch_id: '1362203802',
            device_info: reqBody.device_code,
            nonce_str: fetchNonceStr(),
            // sign: '',
            body: reqData.body,
            // detail: ,
            // attach: ,
            out_trade_no: tradeNo,
            // fee_type: ,
            // total_fee: reqData.total_fee,
            total_fee: 30000,
            spbill_create_ip: '127.0.0.1',
            // time_start: ,
            // time_expire: ,
            // goods_tag: ,
            notify_url: 'http://www.haofumu100.com/api/pay/notify/' + tradeNo + '.html',
            trade_type: 'APP',
            // limit_pay: ,
        };

        postData = Ksort(postData);
        postData.sign = fetchSign(postData).toUpperCase();

        var builder = new xml2js.Builder({
            rootName: 'xml',
            headless: true,
        });
        var parser = new xml2js.Parser({
            explicitArray: false,
        });
        var xml = builder.buildObject(postData);

        var req = https.request(options, function(response) {
            var chunkData = null;
            var resultData = {};
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                chunkData = chunk;
            });
            response.on('end', function() {
                parser.parseString(chunkData, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    resultData = result.xml;
                });

                if (response.statusCode == 200) {
                    if (resultData.return_code == 'SUCCESS') {
                        if (resultData.result_code == 'SUCCESS') {
                            var orderData = {
                                userID: userID,
                                addUserId: userID,
                                updUserId: userID,
                                tradeNo: tradeNo,
                                // totalFee: reqData.total_fee,
                                totalFee: 30000,
                                type: reqData.type,
                                body: reqData.body
                            };

                            var signParams = {
                                appid: resultData.appid,
                                partnerid: resultData.mch_id,
                                prepayid: resultData.prepay_id,
                                package: 'Sign=WXPay',
                                noncestr: resultData.nonce_str,
                                timestamp: Math.round(new Date().getTime() / 1000),
                            };
                            signParams.sign = fetchSign(signParams).toUpperCase();

                            var returnData = {
                                prepay_id: resultData.prepay_id,
                                mch_id: resultData.mch_id,
                                nonce_str: resultData.nonce_str,
                                timestamp: signParams.timestamp,
                                sign: signParams.sign,
                                tradeNo: tradeNo,
                            };
                            createPay(orderData, returnData);
                        } else {
                            resData = {
                                code: '50698',
                                msg: resultData.err_code + ':' + resultData.err_code_des,
                                data: null
                            };
                            res.send(resData, {
                                'Content-Type': 'application/json'
                            }, 200);
                        }
                    } else {
                        resData = {
                            code: '50699',
                            msg: resultData.return_msg,
                            data: null
                        };
                        res.send(resData, {
                            'Content-Type': 'application/json'
                        }, 200);
                    }
                } else {
                    res.send(errorCode['50601'], errorCode.type, 200);
                }
            });
        })

        req.write(xml);
        req.end();

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

function fetchSign(postData) {
    return MD5(jsonToPostDataStr(Ksort(postData)) + '&key=BCAED755483B88111E2AFE73DAA7BC50');
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

function fetchNonceStr() {
    return MD5(Math.random() + '');
}

module.exports = payWx;
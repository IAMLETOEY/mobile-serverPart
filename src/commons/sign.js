var crypto = require('crypto');
var MD5 = require(__root + '/common/md5'); // MD5('string')
var Ksort = require(__root + '/common/ksort'); // Ksort(object)

var sign = {
    wxSign: function(data){

    },
    WxJSSDK: function(signParams){
        return this.sha1(this.jsonToPostDataStr(this.Ksort(signParams)));
    },
    sha1: function(str){
        var shasum = crypto.createHash('sha1');
        shasum.update(str, 'utf8');
        var str = shasum.digest('hex');
        console.log(str)
        return str;
    },
    MD5: MD5,
    Ksort: Ksort,
    jsonToPostDataStr: jsonToPostDataStr,
    fetchNonceStr: fetchNonceStr,
    fetchTradeNo: fetchTradeNo,
    fetchTimestamp: fetchTimestamp,
};

module.exports = sign;

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

function fetchTimestamp(){
    return Math.round(new Date().getTime() / 1000);
}
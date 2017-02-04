/**
 * vue渲染器
 */

// P.S.
// var Vue = require(__root + '/src/commons/vueServer');
// Vue.render({
//     template: __root + '/views/xxx-V.html',
//     data: {
//         list: list
//     },
//     filters: {}
// });

var vueServer = require('vue-server');
var Vue = new vueServer.renderer();
var fs = require('fs');

Date.prototype.Format = function (fmt) {
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
};

module.exports = {
    render: function (opts, callback) {
        var vueInstance = new Vue({
            template: fs.readFileSync(__root + ProjectPath + '/views' + opts.template, 'utf-8'),
            data: opts.data,
            filters: (function () {
                return _.extend({
                    transDate: function (value) {
                        if (!value) return '';
                        return (new Date(value)).Format('yyyy-MM-dd hh:mm:ss');
                    }
                }, opts.filters);
            })()
        });

        vueInstance.$on('vueServer.htmlReady', function (html) {
            callback && callback(html)
        });
    }
};
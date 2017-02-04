var code = {
    '123': {
        title: '系统管理',
        target: '',
        icon: ''
    },
    '123001': {
        title: '系统概览',
        target: '概览',
        icon: ''
    },
    '123222': {
        title: '用户设置',
        target: '',
        icon: ''
    },
    '123222333': {
        title: '系统概览',
        target: '新建用户',
        icon: ''
    },
    '123222444': {
        title: '系统概览',
        target: '用户列表',
        icon: ''
    }
};

var power = ['123222333', '123001', '123222444', '123222'];

var _ = {
    each: function (list, callabck) {
        for (var i = 0; i < list.length; i++) {
            callabck(list[i], i)
        }
    }
}

function buildSlideBar() {
    power = power.sort();
    var existObj = {};
    var result = [];
    _.each(power, function (item) {
        var one = item.slice(0, 3);
        var two = item.slice(0, 6);
        var thr = item.slice(0, 9);
        if (existObj[one] > -1) {
            if (item.length == 6) {
                result[existObj[one]].sub.push({
                    code: two,
                    title: code[two].title,
                    target: code[two].target,
                    icon: code[two].icon,
                    sub: []
                });
                existObj[two] = result[existObj[one]].sub.length - 1;
            } else if (item.length == 9) {
                if (existObj[two] > -1) {
                    result[existObj[one]].sub[existObj[two]].sub.push({
                        code: thr,
                        title: code[thr].title,
                        target: code[thr].target,
                        icon: code[thr].icon,
                        sub: []
                    });
                } else {
                    result[existObj[one]].sub.push({
                        code: two,
                        title: code[two].title,
                        target: code[two].target,
                        icon: code[two].icon,
                        sub: [{
                            code: thr,
                            title: code[thr].title,
                            target: code[thr].target,
                            icon: code[thr].icon,
                            sub: []
                        }]
                    });
                    existObj[two] = result[existObj[one]].sub.length - 1;
                }
            }
        } else {
            result.push({
                code: one,
                title: code[one].title,
                target: code[one].target,
                icon: code[one].icon,
                sub: [{
                    code: two,
                    title: code[two].title,
                    target: code[two].target,
                    icon: code[two].icon,
                    sub: []
                }]
            });
            existObj[one] = result.length - 1;
            existObj[two] = 0;
        }
    });
    console.log(JSON.stringify(result), result);
}

buildSlideBar();

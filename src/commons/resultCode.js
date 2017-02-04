/**
 * 结果码
 */
var resultCode = {
    'type': { 'Content-Type': 'application/json' },
    // 成功, 返回空
    '200': {
        code: '200',
        msg: 'success',
        data: null
    },
    // 系统相关
    '50000': {
        code: '50000',
        msg: '服务器连接出错!请重新尝试!',
        data: null
    },
    '50001': {
        code: '50001',
        msg: '提交数据失败!',
        data: null
    },
    '50002': {
        code: '50002',
        msg: '登录状态已过期!',
        data: null
    },
    // 用户相关
    '50100': {
        code: '50100',
        msg: '手机号码已存在!',
        data: null
    },
    '50101': {
        code: '50101',
        msg: '账号或者密码不正确!',
        data: null
    },
    '50102': {
        code: '50102',
        msg: '找不到该用户信息!',
        data: null
    },
    '50103': {
        code: '50103',
        msg: '已经签到过了!',
        data: null
    },
    '50104': {
        code: '50104',
        msg: '第三方登录失败!',
        data: null
    },


    //通知管理
    '50200': {
        code: '50200',
        msg: '暂无通知!',
        data: null
    },
    '50201': {
        code: '50201',
        msg: '通知不存在',
        data: null
    },
    //公司管理
    '50300': {
        code: '50300',
        msg: '找不到相应公司',
        data: null
    },
};

module.exports = resultCode;

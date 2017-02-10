/**
 * 结果码
 */
var resultCode = {
    'type': {'Content-Type': 'application/json'},
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

    //手机相关
    '50200': {
        code: '50200',
        msg: '文件上传失败!',
        data: null
    },
    '50201': {
        code: '50201',
        msg: '通知不存在',
        data: null
    },
    //订单相关
    '50300': {
        code: '50300',
        msg: '商品已经被购买!',
        data: null
    },
    '50301': {
        code: '50301',
        msg: '商品价格错误!',
        data: null
    },
    '50302': {
        code: '50302',
        msg: '创建订单失败!',
        data: null
    },
};

module.exports = resultCode;

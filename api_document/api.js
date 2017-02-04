/**
 * name 接口文档
 * time 2017-01-11 04:45:14
 * auth promeyang

 * 接口汇总
 * 1.评判表详情: /app/option/detail.do
 * 2.评判表列表: /app/option/list.do
 * 3.创建企业信息: /app/company/create.do
 * 4.企业信息列表: /app/company/list.do
 * 5.企业信息详情: /app/company/detail.do
 * 6.企业信息编辑: /app/company/edit.do
 */

//1.评判表详情
var url = '/app/option/detail.do';
var reqObj = {
    data: {
        id: '1000', //默认1000
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": { "_id": 1000, "table": [{ "type": "group", "title": "分组一", "children": [{ "type": "text", "title": "企业名字" }, { "type": "area", "title": "企业所在地区" }, { "type": "radio", "title": "是否安全", "children": [{ "type": "radioItem", "title": "安全", "score": "1" }, { "type": "radioItem", "title": "不安全", "score": "2" }] }] }], "name": "测试" }
};

//2.评判表列表
var url = '/app/option/list.do';
var reqObj = {
    data: {}
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": []
};

//3.创建企业信息
var url = '/app/company/create.do';
var reqObj = {
    data: {
        table: [], //企业信息对照的数据数组
        option: 1000, //选项表id
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": null
};

//4.企业信息列表
var url = '/app/company/list.do';
var reqObj = {
    data: {}
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": [{}]
};

//5.企业信息详情
var url = '/app/company/detail.do';
var reqObj = {
    data: {
        id: 1000, //企业信息id
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": {}
}

//6.企业信息编辑
var url = '/app/company/edit.do';
var reqObj = {
    data: {
        id: 1000, //企业信息id
        table: [], //企业信息对照的数据数组
        option: 1000, //选项表id
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": null
};

//7.用户登录
var url = '/app/user/login.do';
var reqObj = {
    data: {
        loginName: 'loginName', //登录名
        password: 'password' //登录密码
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": {
        sessionID: sessionID,
        UserInfo: UserInfo
    }
};

//8.用户信息
var url = '/app/user/info.do';
var reqObj = {
    data: {}
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": {
        UserInfo: UserInfo
    }
};

//9.更新用户信息
var url = '/app/user/update.do';
var reqObj = {
    data: {
        name: '123'
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": null
};

//10.更新用户头像
var url = '/app/user/avatar.do';
var reqObj = {
    data: {
        base64: 'base64'
    }
};
var resObj = {
    "code": "200",
    "msg": "success",
    "data": {
        avatar: 'path'
    }
};
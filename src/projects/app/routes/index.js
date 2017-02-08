module.exports = function (app) {
    // 用户
    require('./user/login')(app);
    require('./user/register')(app);
    require('./user/info')(app);
    require('./user/update')(app);
    require('./user/avatar')(app);
    //手机
    require('./phone/add')(app);
    require('./phone/list')(app);
    require('./phone/detail')(app);
    require('./phone/addComment')(app);
};

/**
 * 普通用户表
 */
var UserSchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    loginName: {type: String, required: true}, // 用户登录名
    password: {type: String, required: true}, // 密码
    name: {type: String, required: true}, // 姓名
    type: {type: Number, required: true}, // 1.系统操作用户2.只查看用户
    avatar: {type: String, default: ''}, // 头像

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'Users',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var User = mongoose.model('User', UserSchema);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;

var MD5 = require(__root + '/src/commons/md5');

User.findOneAsync({
    _id:0
}).then(function (result) {
    if(!result){
        User.createAsync({
            _id:0,
            loginName: MD5(new Date().getTime() + ''),
            password: MD5(new Date().getTime() + Math.round(Math.random()*10000) + ''),
            name:"默认用户",
            type:1
        });
    }
}).catch(function (err) {
    console.log('models/User create err:---->', err);
});
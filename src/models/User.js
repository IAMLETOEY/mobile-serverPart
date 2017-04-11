/**
 * 用户表
 */
var UserSchema = mongoose.Schema({
    account: {type: String, required: true}, // 用户登录名(电话)
    password: {type: String, required: true}, // 密码
    address: {type: String, required: true}, // 地址
    avatar: {type: String, default: ''}, // 头像
    nickName: {type: String, default: ''}, //昵称
    idCard: {type: Number, required: true}, //身份证
    type: {type: Number, default: 1}, // 1.普通用户2.评测机构
    money: {type: Number, default: 0}, //账户余额

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0}, // 创建者
    updUser: {type: Number, default: 0}, // 更新者
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

/**
 * 普通用户表
 */
var UserSchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    account: {type: String, required: true}, // 用户登录名
    password: {type: String, required: true}, // 密码
    phone: {type: Number, required: true}, //电话
    address: {type: String, required: true}, // 地址
    sex: {type: Number, default: 0}, //性别 0.男1.女
    avatar: {type: String, default: ''}, // 头像
    nickname: {type: String, required: true}, //昵称
    idCard: {type: Number, required: true}, //身份证
    type: {type: Number, required: true}, // 1.普通用户2.评测机构

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

/**
 * 手机表
 */
var PhoneSchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    model: {type: String, required: true}, // 手机型号
    internal: {type: Number, default: ''}, // 存储容量
    RAM: {type: Number, default: ''}, // 内存
    net: {type: String, default: 0}, //网络制式
    color: {type: String, default: ''}, // 颜色
    buyChannel: {type: String, default: ''}, //购买渠道
    warranty: {type: String, default: ''}, //保修情况
    border: {type: String, default: ''}, //边框情况
    screen: {type: String, default: ''}, // 屏幕情况
    maintenance: {type: String, default: ''}, //维修情况
    failure: {type: Mixed, default: ''}, //故障情况
    isCertified: {type: Number, default: 0}, //认证情况  0.未认证1.已认证
    imputedPrice: {type: Number, default: 0}, //估算价格
    isPurchased: {type: Number, default: 0}, // 是否已被购买 0.未被购买 1.已被购买
    // purchased: {
    //     user:{type:Number},//购买者ID
    //     price:{type:Number}//购买价格
    // }, //购买情况

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 添加者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

PhoneSchema.plugin(autoIncrement.plugin, {
    model: 'Phones',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Phone = mongoose.model('Phone', PhoneSchema);
Promise.promisifyAll(Phone);
Promise.promisifyAll(Phone.prototype);

module.exports = Phone;

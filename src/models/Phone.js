/**
 * 手机表
 */
var PhoneSchema = mongoose.Schema({
    model: {type: String, required: true}, // 手机型号
    internal: {type: Number, required: true}, // 存储容量
    RAM: {type: Number, required: true}, // 内存
    net: {type: String, default: ''}, //网络制式
    color: {type: String, default: ''}, // 颜色
    buyChannel: {type: String, default: ''}, //购买渠道
    warranty: {type: Number, default: ''}, //保修情况, 1处于保修期 2.超过保修期
    border: {type: Number, default: ''}, //边框情况
    screen: {type: Number, default: ''}, // 屏幕情况
    maintenance: {type: Number, default: ''}, //维修情况
    failure: {type: String, default: ''}, //故障情况
    isCertified: {type: Number, default: 0}, //认证情况  0.未认证1.已认证
    imputedPrice: {type: Number, default: 0}, //估算价格
    sellerPrice: {type: Number, default:0},//卖家报价
    isPost: {type: Number, default:0}, // 是否已经发布 0.未发布 1.已经发布
    isPurchased: {type: Number, default: 0}, // 是否已被购买 0.未被购买 1.已被购买
    photo: {type: String, default: ''},//手机图片

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number}, // 添加者
    updUser: {type: Number, default: 0}, // 更新者
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

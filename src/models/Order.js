/**
 * 订单表
 */
var OrderSchema = mongoose.Schema({
    phone: {type: Number, require: true, ref: 'Phone'}, // 手机id
    price: {type: Number, default: 0}, // 价格
    address: {type: String, require: true}, //收货地址
    receiver: {type: String}, //收货人
    receiverPhone: {type: Number}, //收货人手机号
    transport: {type: Number, default: 0}, // 快递单号
    photo: {type: String, default: ''}, //寄件拍照
    status: {type: Number, default: 0}, //交易状态 0.未发货 1.已发货 2.已确认
    seller: {type: Number, require: true}, //卖家ID

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, require: true, ref: 'User'}, // 添加者(购买者)
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

OrderSchema.plugin(autoIncrement.plugin, {
    model: 'Orders',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Order = mongoose.model('Order', OrderSchema);
Promise.promisifyAll(Order);
Promise.promisifyAll(Order.prototype);

module.exports = Order;

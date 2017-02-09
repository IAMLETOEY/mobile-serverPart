/**
 * 估价表
 */
var PriceSchema = mongoose.Schema({
    model: {type: String}, // 手机型号
    price: {type: Number}, // 手机价格

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number}, // 添加者
    updUser: {type: Number, default: 0}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

PriceSchema.plugin(autoIncrement.plugin, {
    model: 'Prices',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Price = mongoose.model('Price', PriceSchema);
Promise.promisifyAll(Price);
Promise.promisifyAll(Price.prototype);

module.exports = Price;

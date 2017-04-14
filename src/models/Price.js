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
var PhoneInfo =[{
    model:'小米Note',
    price: 700
},{
    model: '苹果5',
    price: 1200
},{
    model: '苹果6',
    price: 2700
},{
    model: '苹果6plus',
    price: 2000
},{
    model: '苹果6Plus',
    price: 2000
},{
    model: '苹果6s',
    price: 3000
},{
    model: '苹果6S',
    price: 3000
},{
    model: '苹果6splus',
    price: 3500
},{
    model: '苹果6sPlus',
    price: 3500
},{
    model: '苹果6Splus',
    price: 3500
},{
    model: '苹果6SPlus',
    price: 3500
},{
    model: '苹果7',
    price: 4000
},{
    model: '魅族MX5',
    price: 1200
},{
    model: '魅族MX6',
    price: 1300
},{
    model: '魅族MX6PRO',
    price: 2000
}];
var Price = mongoose.model('Price', PriceSchema);
Price.find({delFlag:2}).then(function (result) {
    if(result.length == 0){
        Price.insertMany(PhoneInfo);
    }
});

Promise.promisifyAll(Price);
Promise.promisifyAll(Price.prototype);

module.exports = Price;

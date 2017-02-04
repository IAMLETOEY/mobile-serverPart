/**
 * 核心事务表
 */
var TransactionSchema = mongoose.Schema({
    data: {type: mongoose.Schema.Types.Mixed, required: true},// 事务多方数据
    isLeader: {type: Number, default: 2},   //组长flag：1.是组长 2.不是组长

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

var Transaction = mongoose.model('Transaction', TransactionSchema);
Promise.promisifyAll(Transaction);
Promise.promisifyAll(Transaction.prototype);

module.exports = Transaction;

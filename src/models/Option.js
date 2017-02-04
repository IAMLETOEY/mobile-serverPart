/**
 * 评判选项表
 */
var OptionSchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    name: {type: String, required: true}, // 评判表名称
    table: {type: mongoose.Schema.Types.Mixed, required: true}, // 评判表数据

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

OptionSchema.plugin(autoIncrement.plugin, {
    model: 'Options',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Option = mongoose.model('Option', OptionSchema);
Promise.promisifyAll(Option);
Promise.promisifyAll(Option.prototype);

module.exports = Option;

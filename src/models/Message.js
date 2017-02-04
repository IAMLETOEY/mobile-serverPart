/**
 * 消息表
 */

var MessageSchema = mongoose.Schema({
    _id: {type: Number, require: true},   //id
    type: {type: Number, require: true},  //消息类型
    title: {type: String, default: ''},   //消息标题
    briefIntr : {type: String, default: ''},   //内容简介
    content: {type: String, dafault: ''},  //消息内容
    checkGroup:{type: mongoose.Schema.Types.Mixed},// 用户查看情况   含有: userID, delFlag, addDate, updDate,

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

MessageSchema.plugin(autoIncrement.plugin, {
    model: 'Messages',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Message = mongoose.model('Message', MessageSchema);
Promise.promisifyAll(Message);
Promise.promisifyAll(Message.prototype);

module.exports = Message;
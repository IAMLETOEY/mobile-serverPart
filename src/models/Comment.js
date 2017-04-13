/**
 * 评论表
 */
var CommentSchema = mongoose.Schema({
    object : {type: Number, required: true}, // 评论对象ID,商品或者订单
    response: {type: Number, default: ''}, // 回复对象，可为空，若有则为回复他人评论
    content: {type: String, default: ''}, //回复内容
    type: {type: Number, require: true}, //评价类型  1.商品评价 2.用户评价

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number}, // 评论者ID
    updUser: {type: Number, default: 0}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

CommentSchema.plugin(autoIncrement.plugin, {
    model: 'Comments',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Comment = mongoose.model('Comment', CommentSchema);
Promise.promisifyAll(Comment);
Promise.promisifyAll(Comment.prototype);

module.exports = Comment;

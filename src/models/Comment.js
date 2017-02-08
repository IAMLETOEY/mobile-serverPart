/**
 * 评论表
 */
var CommentSchema = mongoose.Schema({
    phone: {type: Number, required: true}, // 手机ID
    user: {type: Number, required: true}, // 存储容量
    response: {type: Number}, // 回复对象，可为空，若有则为回复他人评论
    content: {type: String, default: ''}, //回复内容

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, ref: 'User'}, // 评论者ID
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

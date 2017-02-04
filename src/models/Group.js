/**
 * 分组表
 */
var GroupSchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    name: {type: String, required: true}, // 组名称
    text: {type: String, required: true}, // 组描述
    leaderPower: {type: [], required: true}, // 组长权限  1.查看2.新建3.修改4.删除5.打印6.修改报告编号7.查看附件8.上传附件9.删除附件
    memberPower: {type: [], required: true}, // 组员权限  1.查看2.新建3.修改4.删除5.打印6.修改报告编号7.查看附件8.上传附件9.删除附件

    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

GroupSchema.plugin(autoIncrement.plugin, {
    model: 'Groups',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Group = mongoose.model('Group', GroupSchema);
Promise.promisifyAll(Group);
Promise.promisifyAll(Group.prototype);

module.exports = Group;

Group.findOneAsync({
    _id:0
}).then(function (result) {
    if(!result){
        Group.createAsync({
            _id:0,
            name:"默认分组",
            text:"默认分组",
            leaderPower:[0],
            memberPower:[0]
        })
    }
}).catch(function (err) {
    console.log('models/Group create err:---->', err);
});
/**
 * 企业信息表
 */
var CompanySchema = mongoose.Schema({
    _id: {type: Number, required: true}, // id
    table: {type: mongoose.Schema.Types.Mixed, required: true}, // 信息表数据
    totalScore:{type: Number, default: 0}, //总分
    baseInfo: {
        companyName:String, //客户名称
        policyNum: String,  //保单号码
        entrustIns: String,  //委托机构
        address:String, //地址
        insIndex: Number,  //1.1、房屋   2、设备    3、原料     4、产成品
        insAssetLocation:{      //保险财产处于
            closestToWater: String,     //距离江河湖的最近距离
            lowerThanRoad: Number,  //建筑物地面是否比路面低    1 是  2 否
            closeToHill: Number    //是否临近山坡    1是  2否
        },
        buildArea: {    //建筑面积
            area: Number,   //面积
            howOld:  String,   //几成新
            ageLimit:  Number   //建成年限
        },
        enterpriseProp: Number,     //企业性质  1国企 2三资 3私营企业   4集体经营   5股份企业   6个体户
        houseProp:  Number, // 房产性质 1自建 2购买 3租赁
        houseFunc: Number,  //房产使用功能    1、办公   2、生产   3、商贸   4、普通仓储   5、易燃、危险品仓储  6、特别危险品仓储   7、其他
        productClassify: Number,    //产品类别      1、化工油品   2、塑料塑胶  3、化纤棉纺品  4、纸品  5、木材    6、电子器件    7、五金配件      8、其它
        commissioning:{     //投产时间
            date: String,     //什么时候投产
            isUpdateIn3: Number //三年内设备是否改造更新  1有  2无
        },
        staff:{     //人员情况
            sum: Number,    //人员总数
            management: Number,     //管理人员
            product: Number     //生产工人
        },
        manufactureTech: {              //生产工艺
            hasFire: Number,    //生产过程中是否产生明火       1是  2否
            isHighTemp: Number,    //生产工艺是否高温高压？      1、是 2、否
            isElectrical: Number,     //有否电镀、电锯漆、电喷涂烘烤工艺？    1、是 2、否
            isSpray: Number,    //喷漆工艺：1、是 2、否
            isSingleSpray: Number,  //独立的喷漆车间：1、是 2、否
            isIsolation: Number,   //如不独立，有否隔离措施：1、是 2、否
            dustFreePlant:  Number,     //无尘车间：1、是 2、否
            isDanger: Number,   //有否使用或储存易燃易爆化学液体或气体    1、是 2、否
            hasABS: Number,     //有无以下原材料仓储：ABS粉    1、是 2、否
            hasFPB: Number,     //有无以下原材料仓储：发泡笨     1、是 2、否
            hasPOM: Number,     //有无以下原材料仓储：POM聚甲栓     1、是 2、否
            hasSponge: Number     //有无以下原材料仓储：海绵     1、是 2、否
        },
        fireDanger: Number,  //生产火灾危险性      1、甲（最危险级） 2、乙  3、丙  4、丁  5、戊
        lastValue: Number,  //企业去年产值    1、大于1亿元	2、1000万～1亿  3、500万～1000万 4、500万以下
        mainMarket: Number,    //产品主要市场      1、出口为主（出口50%以上）2、内销为主（内销50%以上）
        manSituation: Number,  //企业生产状况   	1、正常生产  2、基本停产  3、停产
        insSituation:  Number   //  保险状况	近三年是否有出险记录    1、是   2、否
    },
    option: {type: Number, required: true, ref: 'Option'}, // 评判表id
    reportNum: {type: String, default: ''},  //报告编号
    isDanger: {type: String, default: ''},  //是否存在重大隐患  0.否  1 是
    addDate: {type: Date, default: Date.now}, // 创建时间
    updDate: {type: Date, default: Date.now}, // 更新时间
    addUser: {type: Number, default: 0, ref: 'User'}, // 创建者
    updUser: {type: Number, default: 0, ref: 'User'}, // 更新者
    delFlag: {type: Number, default: 2} // 删除标志(1删除2未删除)
});

CompanySchema.plugin(autoIncrement.plugin, {
    model: 'Companys',
    field: '_id',
    startAt: 1000,
    incrementBy: 1
});

var Company = mongoose.model('Company', CompanySchema);
Promise.promisifyAll(Company);
Promise.promisifyAll(Company.prototype);

module.exports = Company;

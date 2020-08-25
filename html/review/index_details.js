define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("review/index_details_view"),
    data: {
      minDate: new Date(2010, 0, 1), // 日期范围
      // 总单据类型
      billList: [
        { text: "发票", value: "INVOICE" },
        { text: "银行", value: "BANK" },
        { text: "海关", value: "CUSTOMS" },
        { text: "财政", value: "FINANCIAL" },
      ],
      id: "", //单据id
      billType: "INVOICE", // 默认单据类型
      billData: {}, //单据数据
      lineArray: [], // 增加行删除行数组
      lineObj: {}, //添加对象
      lineStatus:false, //能否操作行状态 -- 为true允许增删 false禁止
      showDate: false, //日期显示状态
      curList: [{text:'人民币',value:'人民币'}], //币种列表
      proList: [], // 所属项目、部门列表
      // 发票 - 业务类型
      businessList: [
        { text: "存货采购发票", value: "Inventory" },
        { text: "固定资产采购发票", value: "FixedAssets" },
        { text: "销售发票", value: "Sale" },
        { text: "费用采购发票", value: "Cost" },
      ],
      // 发票 - 固定资产采购发票生成的itemList 下拉项
      fixShow:false,
      // 资产类别
      fxkndList:[
        {text:'电子设备',value:'0001'},
        {text:'与生产经营活动有关的器具、工具、家具等',value:'0002'},
        {text:'飞机、火车、轮船、机械和其他生产设备',value:'0003'},
        {text:'飞机、火车、轮船以外的运输工具',value:'0004'},
        {text:'房屋、建筑物',value:'0005'},
        {text:'其他',value:'0006'},

      ],
      // 取得方式
      fxgetList:[
        {text:'购入',value:'1'},
        {text:'接受投资',value:'2'},
        {text:'接受捐赠',value:'3'},
        {text:'融资租入',value:'4'},
        {text:'自建',value:'5'},
        {text:'交换',value:'6'},
        {text:'其他',value:'7'},
        {text:'盘盈',value:'8'},
      ],
      // 使用状况
      fxstatusList:[
        {text:'使用中',value:'1'},
        {text:'出售',value:'2'},
        {text:'报废',value:'3'},
      ],
      // 已折旧年月
      fxdisDdList:[
        {text:'1',value:'1'},
        {text:'2',value:'2'},
        {text:'3',value:'3'},
        {text:'4',value:'4'},
        {text:'5',value:'5'},
        {text:'6',value:'6'},
        {text:'7',value:'7'},
        {text:'8',value:'8'},
        {text:'9',value:'9'},
        {text:'10',value:'10'},
        {text:'11',value:'11'},
        {text:'12',value:'12'},
      ],
      businessShow:false, //只在发票 - 业务类型为：费用代码时显示
      // 海关 - 业务类型
      subList:[
        {text:'存货采购',value:'存货采购'},
        {text:'固定资产',value:'固定资产'},
        {text:'进口关税',value:'进口关税'}
      ],
      customShow:false,
      // 银行 - 款项类型
      bankList:[
        {text:'客户收款单',value:'CustomerAccept'},
        {text:'其他收款单',value:'OtherAccept'},
        {text:'厂商付款单',value:'VendorPayment'},
        {text:'其他付款单',value:'OtherPayment'},
        {text:'调拨单',value:'Allot'}
      ],
      bankShow:false,
      // 成本属性
      attrList:[
        {text:'销售费用',value:'销售费用'},
        {text:'制造费用',value:'制造费用'},
        {text:'研发费用-费用性支出',value:'研发费用-费用性支出'},
        {text:'研发费用-资本性支出',value:'研发费用-资本性支出'},
        {text:'财务费用',value:'财务费用'},
        {text:'工程施工',value:'工程施工'},
        {text:'劳务成本',value:'劳务成本'},
      ],
      // 扣税类别
      taxList:[
        {text:'不计税',value:'1'},
        {text:'应税内含',value:'2'},
        {text:'应税外加',value:'3'},
      ],
      costList:[], // 费用代码
      timer:null, // 名称查询费用代码定时器
      showCost:false,
      indexCost:-1,
      typeList: [],
      typeId: 1,
      // 存货业务类型
      stockList: [
        { name: "采购入库", id: 1 },
        { name: "生产领料", id: 2 },
        { name: "生产入库", id: 3 },
        { name: "销售出库", id: 4 },
      ],
      stockID: 1,
      stockStatus: true, //隐藏表格列
      stockStatu2: true, //隐藏存货单据识别内容行
    },
    created: function () {
      this.id = api.pageParam.id;
      this.billData.imgUrl = api.pageParam.imgUrl
      if(!api.pageParam.type){
        this.billType = "INVOICE"
        this.changBillDef()
        this.getNewObj()
        _g.toast('单据识别失败，请手动填写')
      }else{
        this.billType = api.pageParam.type
        this.getDetails();
      }
      console.log(this.billType, "单据类型", this.id, "单据id");
      this.getCur();
      this.getProject();
    },
    methods: {
      // 单据审核提交
      sumbit() {
        // console.log(this.billData,'准备提交的数据')
        // return false
        this.billData.date = new Date(this.billData.date).Format("yyyy-MM-dd");
        console.log(this.billData,'提交数据')
        // return false
        var self = this;
        var url = "api/control/beatReceipt/audit";
        var option = {
          data: {
            [self.billType.toLowerCase()]: self.billData,
            userId: _g.getLS("userId"),
            type: this.billType,
            receiptId: self.id,
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的数据");
            // if (ret.code == 200) {
              _g.toast(ret.message);
              setTimeout(function () {
                api.closeWin();
                _g.execScript({
                  winName:'review-index-win',
                  frameName: 'review-index-frame',
                  fnName:'UpdateRevFn'
                });
              }, 800);
            // }else{
            //   _g.toast(ret.message)
            //   setTimeout(function () {
            //     api.closeWin();
            //     _g.execScript({
            //       winName:'review-index-win',
            //       frameName: 'review-index-frame',
            //       fnName:'UpdateRevFn'
            //     });
            //   }, 800);
            // }
          },
        });
      },
      // 获取单据详情
      getDetails() {
        this.getNewObj();
        var self = this;
        var url = "api/control/beatReceipt/view";
        var option = {
          data: {
            id: self.id,
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret,'????')
            console.log(ret.data, "获取到的单据数据");
            self.billData = ret.data[self.billType.toLowerCase()];
            self.lineArray = self.billData.itemList ? self.billData.itemList : [];
            self.changBillDef() //该方法用于赋予单据默认值
          },
        });
      },
      changeStockType() {
        // 当存货类型为 生产领料2和销售出库4时，新增行没有单价和金额
        // 当存货类型为 生产领料2和生产入库3时，存货单识别没有销售方一列
        console.log(this.stockID, "切换存货业务类型");
        if (this.stockID === 1) {
          this.stockStatus = true;
          this.stockStatu2 = true;
          this.lineObj = {
            flag: false,
            id: new Date().getTime(),
            name1: "1",
            name2: "2",
            name3: "3",
            name4: "4",
            name5: "5",
            name6: "6",
            name7: "7",
          };
        } else if (this.stockID === 2) {
          this.stockStatus = false;
          this.stockStatu2 = false;
          this.lineObj = {
            flag: false,
            id: new Date().getTime(),
            name1: "1",
            name2: "2",
            name3: "3",
            name4: "4",
            name7: "7",
          };
        } else if (this.stockID === 3) {
          this.stockStatus = true;
          this.stockStatu2 = false;
          this.lineObj = {
            flag: false,
            id: new Date().getTime(),
            name1: "1",
            name2: "2",
            name3: "3",
            name4: "4",
            name5: "5",
            name6: "6",
            name7: "7",
          };
        } else if (this.stockID === 4) {
          this.stockStatus = false;
          this.stockStatu2 = true;
          this.lineObj = {
            flag: false,
            id: new Date().getTime(),
            name1: "1",
            name2: "2",
            name3: "3",
            name4: "4",
            name7: "7",
          };
        }
      },
      // 切换发票业务类型
      changBusinessTyep(){
        if(this.billData.businessType ==='FixedAssets'){
          // 当发票类型为固定资产采购发票时，会增加操作的数据
          this.fixShow = true
        }else{
          this.fixShow = false
        }
        console.log(this.billData.businessType,"发票业务类型")
      },
      // 切换海关业务类型
      changCustomsTyep(){
        if(this.billData.type ==='固定资产'){
          // 当海关类型为固定资产时，会增加操作的数据
          this.customShow = true
        }else{
          this.customShow = false
        }
        console.log(this.billData.type,"海关业务类型")
      },
      // 切换银行款项类型
      changBankType(){
        if(this.billData.code === '1221'){
          this.bankShow = false
        }else{
          if(this.billData.type ==='OtherAccept' || this.billData.type ==='OtherPayment'){
            this.bankShow = true
          }else{
            this.bankShow = false
          }
        }
      },
      // 操作表格行状态
      seletLine(index) {
        this.lineArray[index].flag = !this.lineArray[index].flag;
      },
      // 增加表格行
      addLine() {
        if(this.lineStatus){
          this.lineObj.vid = new Date().getTime() * Math.random();
          this.lineArray.push(JSON.parse(JSON.stringify(this.lineObj)));
          console.log(this.lineArray, "增加行后的数组");
        }else{
          _g.toast('该单据类型不可新增')
        }
      },
      // 删除表格行
      delLine() {
        if(this.lineStatus){
          for (let i = this.lineArray.length - 1; i >= 0; i--) {
            console.log(i);
            if (this.lineArray[i].flag) {
              this.lineArray.splice(i, 1);
            }
          }
        }else{
          _g.toast('该单据类型不可删除')
        }
        console.log(this.lineArray, "lineArray");
      },
      // 用户切换单据类型
      changeBillType(value) {
        console.log(value, "单据类型切换");
        this.lineArray = [];
        this.changBillData();
        this.changBillDef()
        this.getNewObj()
        this.indexCost = -1
      },
      // 不同类型单据切换改变不同的单据对象
      changBillData() {
        if (this.billType === "INVOICE") {
          this.billData = {
            attr: "",
            auditUserId: "",
            businessType: "",
            buyAccount: "",
            buyAddPhone: "",
            buyName: "",
            buyTax: "",
            checkCode: "",
            code: "",
            curId: "",
            dept: "",
            id: "",
            imgUrl: this.billData.imgUrl,
            invoiceCode: "",
            invoiceMoney: "",
            invoiceNotTax: "",
            invoiceNum: "",
            invoiceTax: "",
            invoiceType: "",
            itemList: this.lineArray,
            largeMoney: "",
            makeUserId: "",
            date: "",
            passUserId: "",
            project: "",
            resultData: "",
            saleAccount: "",
            saleAddPhone: "",
            saleName: "",
            saleTax: "",
            taxID: "",
          };
        } else if (this.billType === "BANK") {
          this.billData = {
            acceptAccount: "", //收款人账号
            acceptName: "", //收款人户名
            attr: "", //成本属性
            auditUserId: "", //审核人
            code: "", //费用代码
            codeView:"",
            currency: "", //币别
            date: "", //日期
            id: "", //uuid
            imgUrl: this.billData.imgUrl, //图片路径
            makeUserId: "", //制单人
            money: "", //金额
            passUserId: "", //审批人
            payeeAccount: "", //付款人账号
            payeeName: "", //付款人户名
            project: "", //所属项目
            dept:'',
            transaction: "", //交易流水号
            type: "", //款项类型
            use: "", //用途
          };
        } else if (this.billType === "CUSTOMS") {
          this.billData = {
            auditUserId: "", //审核人
            currency: "", //币别
            attr:'',
            date: "", //日期
            id: "", //uuid
            imgUrl: this.billData.imgUrl, //图片路径
            itemList: this.lineArray, //列表项
            makeUserId: "", //制单人
            name: "", //缴款单位名称
            passUserId: "", //审批人
            payeeAccount: "", //付款人账号
            payeeName: "", //付款人户名
            project: "", //所属项目
            dept:"",
            transaction: "", //交易流水号
            type: "", //款项类型
            use: "", //用途
          };
        } else if (this.billType === "FINANCIAL") {
          this.billData = {
            accept: "", //收款单位
            auditUserId: "", //审核人
            currency: "", //币别
            date: "", //日期
            id: "", //uuid
            attr:"",
            imgUrl: this.billData.imgUrl, //图片路径
            itemList: this.lineArray, //列表项
            makeUserId: "", //制单人
            passUserId: "", //审批人
            project: "", //所属项目
            dept:"",
            type: "", //款项类型
            use: "", //用途
          };
        }
      },
      // 不同单据时需要为其添加的默认值
      changBillDef(){
        var self = this
        if(this.billType === 'INVOICE'){
          // 发票--单据时为其添加的默认值
          this.lineStatus = true
          this.billData.invoiceType = this.billData.invoiceType ? this.billData.invoiceType : "专用发票"
          this.billData.businessType = this.billData.businessType ? this.billData.businessType : "Inventory"
          this.billData.project = this.billData.project ? this.billData.project : '10000'
          this.billData.dept = this.billData.dept ? this.billData.dept : '10000'
          this.billData.attr = this.billData.attr ? this.billData.attr : '销售费用'
          this.billData.taxID = this.billData.taxID ? this.billData.taxID : '1'
          // this.billData.code = this.billData.code ? this.billData.code : '1001'
          this.billData.curId = this.billData.curId ? this.billData.curId : '人民币'
          this.changBusinessTyep()
        }else if(self.billType === 'CUSTOMS'){
          // 海关--单据时为其添加的默认值
          this.lineStatus = true
          this.billData.subType = this.billData.subType ? this.billData.subType : '存货采购'
          this.billData.taxID = this.billData.taxID ? this.billData.taxID : '1'
          this.billData.currency = this.billData.currency ? this.billData.currency : '人民币'
        }else if(self.billType === 'BANK'){
          // 银行--单据需要添加的默认值
          this.lineStatus = false
          this.billData.type = this.billData.type ? this.billData.type : 'CustomerAccept'
          this.billData.project = this.billData.project ? this.billData.project : '10000'
          this.billData.dept = this.billData.dept ? this.billData.dept : '10000'
          this.billData.attr = this.billData.attr ? this.billData.attr : '销售费用'
          // this.billData.code = this.billData.code ? this.billData.code : '1001'
          // this.billData.code = '1221'
          this.billData.currency = this.billData.currency ? this.billData.currency : '人民币'
          // this.getCost(this.billData.code)
          this.changBankType()
        }else if(self.billType === 'FINANCIAL'){
           // 财政--单据需要添加的默认值
          this.lineStatus = true
          this.billData.project = this.billData.project ? this.billData.project : '10000'
          this.billData.dept = this.billData.dept ? this.billData.dept : '10000'
          this.billData.attr = this.billData.attr ? this.billData.attr : '销售费用'
          this.billData.currency = this.billData.currency ? this.billData.currency : '人民币'
        }
      },
      // 不同类型单据点击添加的不同行-对象
      getNewObj() {
        console.log('切换不同行对象')
        if (this.billType === "INVOICE") {
          this.lineObj = {
            flag: true, //默认选中状态
            code:"", //费用代码
            codeView:"",
            serviceName: "", //货物或应税劳务、服务名称
            model: "", //规格型号
            unit: "", //单位
            number: "", //数量
            price: "", //单价
            money: "", //金额
            tax: "", //税率
            taxMoney: "", //税额
            note: "", //摘要
            disDd:'', //已折旧年月
            fxGetMth:'', //取得方式
            fxKnd:'', //资产类别
            stsId:'', //使用状况
          };
        } else if (this.billType === "BANK") {
          this.lineObj = {};
        } else if (this.billType === "CUSTOMS") {
          this.lineObj = {
            flag:true,
            goods:'',
            note:'',
            num:'',
            price:'',
            singlePrice:'',
            tax:'',
            taxPrice:'',
            taxRatio:'',
            unit:'',
            disDd:'', //已折旧年月
            fxGetMth:'', //取得方式
            fxKnd:'', //资产类别
            stsId:'', //使用状况
          };
        } else if (this.billType === "FINANCIAL") {
          this.lineObj = {
            flag: true, //默认选中状态
            money: "", //金额
            num: "", //数量
            code:"", // 费用代码
            codeView:"",
            projectName: "", //项目名称
            standard: "", //标准
            price: "", //单价
            note: "", //备注
            desc: "", //摘要
          };
        }
        console.log(this.lineObj,"新增行对象")
      },
      // 获取币种接口
      getCur() {
        var self = this;
        var url = "api/control/erppage/selectCurList";
        Http.ajax({
          data: {},
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的币种");
            ret.data.forEach(function (v) {
              self.curList.push({ text: v.name, value: v.curId });
            });
          },
        });
      },
      // 获取项目部门接口
      getProject() {
        var self = this;
        var url = "api/control/beatReceipt/project";
        Http.ajax({
          data: {},
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的所属项目和部门");
            ret.data.forEach(function (v) {
              self.proList.push({ text: v.name, value: v.obj });
            });
          },
        });
      },
      // 获取费用代码接口
      // getCost(codePar) {
      //   var self = this;
      //   var url = "api/control/beatReceipt/code";
      //   var sourceVal = ''
      //   if(codePar === '0104'){
      //     sourceVal = 'EXPENSE'
      //   }else if(codePar){
      //     sourceVal = 'ACCN'
      //   }
      //   var options = {
      //     data:{
      //       code:codePar,
      //       source:sourceVal
      //     }
      //   }
      //   Http.ajax({
      //     data: options,
      //     isFile: false,
      //     isJson: true,
      //     method: "post",
      //     isSync: true,
      //     lock: false,
      //     url: url,
      //     success: function (ret) {
      //       console.log(ret, "获取到的费用代码");
      //       if(ret.code == 200){
      //         self.billData.codeView = ret.data.records[0].name ? ret.data.records[0].name : ''
      //         self.billData.code = ret.data.records[0].code ? ret.data.records[0].code : ''
      //       }
      //     },
      //   });
      // },
      // 修改获取费用代码接口
      changCost(namePar){
        if(!namePar){

        }else{
        var self = this;
        var sourceVal = ''
        if(this.billType === 'INVOICE'){
          sourceVal = 'EXPENSE'
        }else if(this.billData.code === '0104'){
          sourceVal = 'EXPENSE'
        }else if(this.billData.code){
          sourceVal = 'ACCN'
        }else {
          sourceVal = ''
        }
        var url = "api/control/beatReceipt/code";
        var options = {
          data:{
            name:namePar,
            source:sourceVal
          }
        }
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "费用代码列表");
            self.costList = []
            if(ret.code == 200){
              ret.data.records.forEach(function(v){
                self.costList.push({text:v.name,value:v.code})
              })
              if(self.costList.length == 0){
                _g.toast('暂无数据信息')
              }else{
                self.showCost = true
              }
            }
          },
        });
        }
      },
      // 防抖查询费用代码
      delayedCost(namePar,index){
        this.indexCost = isNaN(index) ? -1 : index
        console.log(this.indexCost,'触发的索引')
        if(this.timer){
            clearTimeout(this.timer)
            this.timer = null
        }
        this.timer=setTimeout(()=>{
          main.changCost(namePar)
        },1100)
    },
    // 费用代码赋值
    onCost(data) {
      this.showCost = false
      if(this.indexCost < 0){
        this.billData.code = data.value,
        this.billData.codeView = data.text
      }else{
        this.billData.itemList[this.indexCost].code = data.value
        this.billData.itemList[this.indexCost].codeView = data.text
      }
    },
      // 修改日期
      onConfirm(date) {
        this.showDate = false;
        // this.billData.date = this.formatDate(date);
        this.billData.date = date.getTime();
      },
      // 点击查看图片
      handleImgUrl(){
        if(main.billData.imgUrl){
          _g.photoBrowser({picList:[main.billData.imgUrl]})
        }else{
          _g.toast('暂无图片查看')
        }
      }
    },
    filters: {
      formatDate(date) {
        if (!date) {
            return '请选择时间';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd")
          return a
        }
      },
    },
  });
  // _g.setPullDownRefresh(function () {
  //   main.id = api.pageParam.id;
  //     if(!api.pageParam.type){
  //       main.billType = "INVOICE"
  //       main.changBillDef() //该方法用于赋予单据默认值
  //       main.getNewObj()
  //       _g.toast('单据识别失败，请手动填写')
  //     }else{
  //       main.billType = api.pageParam.type
  //       main.getDetails();
  //     }
  // });
  (function () {})();
  module.exports = {};
});

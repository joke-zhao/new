define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("reviewManual/reviewManual_index_view"),
    data: {
      minDate: new Date(2010, 0, 1), // 日期范围
      companyName: "", //机构名称
      classShow: false, //变动账户的显示和隐藏
      billData: {
        // invoiceNum:'',
        // date:'',
        // buyAccount:'',
        // currency:'',
        // project:'',
        // dept:'',
        // attr:'',
        // itemList:[]
        accNo: "", //会计科目
        attr: "销售费用",
        auditUserId: "",
        businessType: "",
        buyAccount: "",
        buyAddPhone: "",
        buyName: "",
        bankName:'', //变动账户
        buyTax: "",
        checkCode: "",
        code: "",
        date: "",
        curId: "人民币",
        dept: "10000",
        project: "10000",
        id: "",
        invoiceCode: "",
        invoiceMoney: "",
        invoiceNotTax: "",
        invoiceNum: "",
        invoiceTax: "",
        invoiceType: "",
        itemList: [
          {
            code: "",
            codeView: "",
            flag: true,
            money: "",
            note: "",
            vid: 1224747211163.4727,
          },
        ],
        largeMoney: "",
        makeUserId: "",
        passUserId: "",
        resultData: "",
        saleAccount: "",
        saleAddPhone: "",
        saleName: "",
        saleTax: "",
        taxID: "",
      },
      lineObj: {
        vid: new Date().getTime() * Math.random(),
        flag: true, //默认选中状态
        code: "", //费用代码
        codeView: "",
        money: "", //金额
        note: "", //摘要
      }, //添加对象
      showDate: false, //日期显示状态
      curList: [{ text: "人民币", value: "人民币" }], //币种列表
      proList: [], // 所属项目、部门列表
      // 成本属性
      attrList: [
        { text: "销售费用", value: "销售费用" },
        { text: "制造费用", value: "制造费用" },
        { text: "研发费用-费用性支出", value: "研发费用-费用性支出" },
        { text: "研发费用-资本性支出", value: "研发费用-资本性支出" },
        { text: "财务费用", value: "财务费用" },
        { text: "工程施工", value: "工程施工" },
        { text: "劳务成本", value: "劳务成本" },
      ],
      // 会计科目
      classList: [
        { text: "库存现金", value: "1001" },
        { text: "银行存款", value: "1002" },
      ],
      OrgList: [], // 机构名称 - 即公司列表
      costList: [], // 费用代码
      timer: null, // 名称查询费用代码定时器
      showCost: false,
      accountList: [],
      timer2: null, //变动账户
      showAccount: false,
    },
    created: function () {
      this.getCur();
      this.getProject();
      this.getCompanyList();
      this.companyName = _g.getLS("companyName");
      this.billData.date = new Date().getTime()
    },
    methods: {
      submit() {
        if(!this.billData.accNo){
          _g.toast('会计科目不能为空')
        }else if(!this.billData.project){
          _g.toast('所属项目不能为空')
        }else if(!this.billData.dept){
          _g.toast('所属部门不能为空')
        }else if(!this.billData.attr){
          _g.toast('成本属性不能为空')
        }else{
          this.billData.date = new Date(this.billData.date).Format("yyyy-MM-dd");
        this.billData.buyName = this.companyName;
        var self = this;
        self.itemList = this.lineObj;
        console.log(this.billData, "准备提交的数据");
        console.log(this.companyName, "准备提交的公司");
        var url = "api/control/beatReceipt/create";
        self.billData.buyName = self.companyName
        var option = {
          data: {
            other: self.billData,
            userId: _g.getLS("userId"),
            companyName: self.companyName,
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
            if (ret.code == 200) {
              _g.toast(ret.message);
              setTimeout(function () {
                api.closeWin();
              }, 800);
            }else{
              _g.toast(ret.message)
            }
          },
        });
        }
        
      },
      // 增加表格行
      addLine() {
        this.lineObj.vid = new Date().getTime() * Math.random();
        this.billData.itemList.push(JSON.parse(JSON.stringify(this.lineObj)));
        console.log(this.billData.itemList, "增加行后的数组");
      },
      // 操作表格行状态
      seletLine(index) {
        this.billData.itemList[index].flag = !this.billData.itemList[index]
          .flag;
      },
      // 删除表格行
      delLine() {
        for (let i = this.billData.itemList.length - 1; i >= 0; i--) {
          console.log(i);
          if (this.billData.itemList[i].flag) {
            this.billData.itemList.splice(i, 1);
          }
        }
        console.log(this.billData.itemList, "this.billData.itemList");
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
      changeClass(value) {
        if (value === "1002") {
          this.classShow = true;
        } else {
          this.billData.buyName = "";
          this.classShow = false;
        }
        console.log(value);
      },
      // 修改获取费用代码接口
      changCost(namePar) {
        if (!namePar) {
        } else {
          var self = this;
          var url = "api/control/beatReceipt/code";
          var options = {
            data: {
              name: namePar,
              source:'EXPENSE'
            },
          };
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
              self.costList = [];
              if (ret.code == 200) {
                ret.data.records.forEach(function (v) {
                  self.costList.push({ text: v.name, value: v.code });
                });
                if (self.costList.length == 0) {
                  _g.toast("暂无数据信息");
                } else {
                  self.showCost = true;
                }
              }
            },
          });
        }
      },
      // 防抖查询费用代码
      delayedCost(namePar, index) {
        this.indexCost = index;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          main.changCost(namePar);
        }, 1100);
      },
      // 修改获取变动账户接口
      changAccount() {
        if (!this.billData.bankName) {
        } else {
          var self = this;
          var url = "api/control/beatReceipt/bankName";
          var options = {
            data: {
              name: this.billData.bankName,
            },
            limit: 20,
            page: 1,
          };
          Http.ajax({
            data: options,
            isFile: false,
            isJson: true,
            method: "post",
            isSync: true,
            lock: false,
            url: url,
            success: function (ret) {
              console.log(ret, "变动账户列表");
              self.accountList = [];
              if (ret.code == 200) {
                ret.data.records.forEach(function (v) {
                  var val = v.name + '(' +v.code +')'
                  self.accountList.push({ text:val,value:v.code,newVal:v.name});
                });
                if (self.accountList.length == 0) {
                  _g.toast("暂无数据信息");
                } else {
                  self.showAccount = true;
                }
              }
            },
          });
        }
      },
      // 防抖查询变动账户
      delayedAccount() {
        if (this.timer2) {
          clearTimeout(this.timer2);
          this.timer2 = null;
        }
        this.timer2 = setTimeout(() => {
          main.changAccount();
        }, 1100);
      },
      //  获取公司列表
      getCompanyList() {
        var self = this;
        var url = "api/control/beatCompany/handleCompany";
        var options = {
          data: {
            userId: _g.getLS('userId'),
          },
        };
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "/???");
            if (ret.code === 200) {
              ret.data.forEach(function(item){
                main.OrgList.push({text:item.name,value:item.name})
              })
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
      onCost(data) {
        this.showCost = false;
        this.billData.itemList[this.indexCost].code = data.value;
        this.billData.itemList[this.indexCost].codeView = data.text;
      },
      onAccount(data) {
        this.showAccount = false;
        this.billData.bankName = data.newVal;
        this.billData.idCode = data.value;
        console.log(data);
      },
      onConfirm(date) {
        this.showDate = false;
        // this.billData.date = this.formatDate(date);
        this.billData.date = date.getTime();
      },
    },
    filters: {
      formatDate(date) {
        if (!date) {
          return "";
        } else {
          var a = new Date(date).Format("yyyy-MM-dd");
          return a;
        }
      },
    },
  });
  (function () {})();
  module.exports = {};
});

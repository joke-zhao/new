define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("reportForm/reportForm_index_view"),
    data: {
      dialogShow: false,
      deptId: "", //公司部门id
      OrgList: [], //公司列表
      formList: [], //公司旗下表单
    },
    created: function () {
      this.getCompanyList();
      this.deptId = _g.getLS("deptId");
      console.log(this.deptId);
    },
    filters: {},
    methods: {
      // 切换公司
      changeCompany(value) {
        // alert(value)
        this.OrgList.forEach(function (v) {
          if (v.value === value) {
            _g.setLS("deptId", v.value);
            _g.setLS("companyName", v.text);
            main.formList = v.formList;
            console.log(main.form);
          }
        });
      },
      //  获取公司列表
      getCompanyList() {
        var self = this;
        var url = "api/control/beatCompany/reportCompany";
        var options = {
          data: {
            userId: _g.getLS("userId"),
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
            console.log(ret, "公司列表详情");
            if (ret.code === 200) {
              main.formList = ret.data[0].dataPermissions;
              console.log(main.formList);
              ret.data.forEach(function (item) {
                main.OrgList.push({
                  text: item.companyName,
                  value: item.deptId,
                  formList: item.dataPermissions,
                });
              });
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
      // 根据名称打开报表
      openNextForm(name) {
        console.log(name);
        switch (name) {
          /* 管理报表 */
          case "资产负债表":
            main.openBalanceSheet();
            break;
          case "损益表":
            main.openProfitAndLoss();
            break;
          case "销管研制费用汇总表":
            main.summaryExpensesManage();
            break;
          case "应收账款明细表":
            main.openAccountReceivable();
            break;
          case "存货明细表":
            main.openInventoryList();
            break;
          case "应付账款明细表":
            main.openAccountPayable();
            break;
          case "其他应收账款":
            // main.openBalanceSheet();
            break;
          case "其他应付账款":
            // main.openBalanceSheet();
            break;
          case "预付账款":
            // main.openBalanceSheet();
            break;
          /* 经营报表 */
          case "销售表":
            main.openSellList();
            break;
          case "工资表":
            // main.openSalaryList();
            break;
          case "场地表":
            main.openPlaceList();
            break;
          case "水电表":
            main.openWaterElectricityList();
            break;
          case "公司整体情况":
            // main.openBalanceSheet();
            break;
          /* 财务账本 */
          case "序时簿":
            main.openXuShiBu();
            break;
          case "总分类帐":
            main.openTotalClassify();
            break;
          case "明细分类帐":
            main.openDetailedClassify();
            break;
          case "记账凭证":
            main.openTally();
            break;
          case "现金银行日记帐":
            main.openBankDiaryBill();
            break;
          /* 纳税申报表 */
          case "个人所得税金表":
            // main.openBalanceSheet();
            break;
          case "增值税申报表":
            // main.openBalanceSheet();
            break;
          case "企业所得税申报表(A类)":
            // main.openBalanceSheet();
            break;
          case "企业所得税申报表(B类)":
            // main.openBalanceSheet();
            break;
          case "企业所得税申报表(年度)":
            // main.openBalanceSheet();
            break;
          case "地方税申报表":
            // main.openBalanceSheet();
            break;
        }
      },
      //打开存货明细表
      openInventoryList() {
        _g.openWin({
          header: { title: "存货明细表" },
          name: "index-inventoryList",
          url: "../manageForm/inventoryList_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //打开应收账款
      openAccountReceivable() {
        _g.openWin({
          header: { title: "应收账款" },
          name: "index-accountReceivable",
          url: "../manageForm/accountsReceivable_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //应付账款
      openAccountPayable() {
        _g.openWin({
          header: { title: "应付账款" },
          name: "index-accountPayable",
          url: "../manageForm/accountsPayable_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //损益表
      openProfitAndLoss() {
        _g.openWin({
          header: { title: "损益表" },
          name: "profitAndLoss-index",
          url: "../manageForm/profitAndLoss_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //场地表
      openPlaceList() {
        _g.openWin({
          header: { title: "场地表" },
          name: "index-placeList",
          url: "../reportForm/reportForm_site_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //水电表
      openWaterElectricityList() {
        _g.openWin({
          header: { title: "水电表" },
          name: "index-waterElectricityList",
          url: "../manageForm/waterElectricity_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //工资表
      openSalaryList() {
        _g.openWin({
          header: { title: "工资表" },
          name: "index-salaryList",
          url: "../businessForm/salaryList_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //销售报表
      openSellList() {
        _g.openWin({
          header: { title: "销售报表" },
          name: "index-sellList",
          url: "../reportForm/sellForm_index_frame.html",
          bounces: false,
          slidBackEnabled: true,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //销管研制费用汇总表
      summaryExpensesManage() {
        _g.openWin({
          header: { title: "销管研制费用汇总表" },
          name: "index-summaryExpensesManage",
          url: "../manageForm/summaryExpensesManage_index_frame.html",
          bounces: false,
          slidBackEnabled: true,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //资产负债表
      openBalanceSheet() {
        _g.openWin({
          header: { title: "资产负债表" },
          name: "index-balanceSheet",
          // url: "../manageForm/balanceSheet_index_frame.html",
          url: "../manageForm/newBalance_index_frame.html",
          bounces: false,
          slidBackEnabled: true,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 记账凭证
      openTally() {
        _g.openWin({
          header: { title: "记账凭证" },
          name: "tally-index",
          url: "../financeForm/tally_index_frame.html",
          bounces: false,
          slidBackEnabled: true,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //序时簿
      openXuShiBu(){
        _g.openWin({
          header: { title: "序时簿" },
          name: "index-xuShiBu",
          url: "../manageForm/xuShiBu_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //总分类账
      openTotalClassify(){
        _g.openWin({
          header: { title: "总分类账" },
          name: "index-totalClassify",
          url: "../manageForm/totalClassify_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //明细分类账
      openDetailedClassify(){
        _g.openWin({
          header: { title: "明细分类账" },
          name: "index-detailedClassify",
          url: "../manageForm/detailedClassify_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //现金银行存款日记
      openBankDiaryBill(){
        _g.openWin({
          header: { title: "现金银行存款日记" },
          name: "index-bankDiaryBill",
          url: "../manageForm/bankDiaryBill_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },


    },
    components: {
      vant,
    },
  });
  _g.setPullDownRefresh(function () {
    main.OrgList = []
    main.getCompanyList()
  });
  (function () {})();
  module.exports = {};
});

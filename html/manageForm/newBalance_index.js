define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    components: { vant },
    template: _g.getTemplate("manageForm/newBalance_index_view"),
    data: {
      /* 啊啊啊 */
      detailsShow: false,
      whyList: [],
      datePicker: "",
      fonetaryFund: "", //货币资金
      transactionalFinancialAssets: "", //交易性金融资产
      notesReceivable: "", //应收票据
      accountsReceivable: "", //应收账款
      prepayments: "", //预付款项
      interestReceivable: "", //应收利息
      dividendsReceivable: "", //应收股利
      otherReceivables: "", //其他应收款
      inventory: "", //存货
      inventory1: "", //存货
      conCurrentAssets: "", //一年内到期的非流动资产
      otherCurrentAssets: "", //其他流动资产
      totalCurrentAssets: "", //流动资产合计
      financialAssetsAvailable: "", //可供出售金融资产
      maturityInvestments: "", //持有至到期投资
      longTermReceivables: "", //长期应收款
      longTermEquityInvestment: "", //长期股权投资
      investmentProperty: "", //投资性房地产
      fixedAssets: "", //固定资产
      projectsUnderConstruction: "", //在建工程
      engineeringMaterials: "", //工程物资
      liquidationFixedAssets: "", //固定资产清理
      productiveBiologicalAssets: "", //生产性生物资产
      oilGasAssets: "", //油气资产
      intangibleAssets: "", //无形资产
      developmentExpenditure: "", //开发支出
      goodwill: "", //商誉
      longTermDeferredExpenses: "", //长期待摊费用
      deferredTaxAssets: "", //递延所得税资产
      otherNonCurrentAssets: "", //其他非流动资产
      totalNonCurrentAssets: "", //非流动资产合计
      totalAssets: "", //资产总计
      shortTermBorrowing: "", //短期借款
      tradingFinancialLiabilities: "", //交易性金融负债
      notesPayable: "", //应付票据
      accountsPayable: "", //应付账款
      advanceReceipt: "", //预收款项
      payrollPayable: "", //应付职工薪酬
      taxPayable: "", //应交税费
      payableInterest: "", //应付利息
      dividendsPayable: "", //应付股利
      otherPayables: "", //其他应付款
      oneYearNonCurrentLiability: "", //一年内到期的非流动负债
      otherCurrentLiability: "", //其他流动负债
      totalFlowResponsibility: "", //流动负责合计
      longTermLoan: "", //长期借款
      bondsPayable: "", //应付债券
      longTermPayable: "", //长期应付款
      specialAccountPayable: "", //专项应付款
      estimatedLiabilities: "", //预计负债
      deferredIncomeTaxLiabilities: "", //递延所得税负债
      otherNonCurrentLiabilities: "", //其他非流动负债
      totalNonCurrentLiabilities: "", //非流动负债合计
      totalLiabilities: "", //负债总计
      paidInCapital: "", //实收资本
      capitalReserve: "", //资本公积
      treasuryStock: "", //库存股
      earnedSurplus: "", //盈余公积
      undistributedProfit: "", //未分配利润
      totalOwnersEquity: "", //所有者权益（或股东权益）合计
      totalLiabilitiesAndOwnerEquity: "", //负债和所有者权益（或股东权益）总计

      /* 啊啊啊 */
      options: [
        { name: "图片", icon: "../../image/icon/image.png" },
        { name: "表格", icon: "../../image/icon/biao.png" },
        // { name: "pdf", icon: "../../image/icon/pdf.png" },
      ],
      showShare: false,
      deptId: "",
      companyName: "",
      startDate: "", //开始时间
      endDate: "", //结束时间
      tableDate: new Date().Format("yyyy-MM"), //查询表格时间
      showDateStart: false, // 开始日期弹框
      showDateEnd: false, // 结束日期弹框
      showDateTable: false, //查询表格
      minDate: new Date(2010, 0),
      maxDate: new Date(2025, 10),
      minEndDate: null,
      maxEndDate: null,
      currentDate: new Date(2020, 0),
      echartList: [],
    },
    created: function () {
      this.deptId = _g.getLS("deptId");
      this.companyName = _g.getLS("companyName");
      this.openStartDate(new Date().getTime());
      this.openEndDate(new Date().getTime());
    },
    methods: {
      // 渲染图表
      initEcharts(val) {
        console.log(val);
        var goodData = [];
        val.value.list.forEach(function (item) {
          goodData.push({
            value: item.amtnqm == 0 ? null : item.amtnqm,
            name: item.kmName == "流动资产合计" ? "其他" : item.kmName,
          });
        });
        var myChart = echarts.init(document.getElementById(val.eId));
        option = {
          title: {
            text: val.value.month,
            x: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: "14",
            },
          },
          tooltip: {
            trigger: "item",
            position: [0, -20, 0, 0], // 提示框显示位置
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            textStyle: {
              fontSize: 12,
            },
          },
          series: [
            {
              name: "本月信息",
              type: "pie",
              radius: "40%", //饼图大小
              center: ["50%", "50%"], //饼图位置
              label: {
                normal: {
                  formatter: "{b} {d}%  ", //百分比指示
                  padding: [-15, -60, 0, -40],
                },
              },
              labelLine: {
                normal: {
                  // length: 14, //指示线长度
                },
              },
              data: goodData,
              itemStyle: {
                normal: {
                  textStyle: {
                    fontSize: 12,
                  },
                  color: function (params) {
                    //自定义颜色
                    var colorList = [
                      "#e062ae",
                      "#37a2da",
                      "#ff9f7f",
                      "#ec3838",
                      "#7a9ff2",
                    ];
                    return colorList[params.dataIndex];
                  },
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        myChart.setOption(option);
      },
      // 获取数据
      getBalanceList() {
        var url = "api/control/assetLiability/Kpi";
        var options = {
          data: {
            deptId: this.deptId,
            startDate: this.startDate,
            endDate: this.endDate,
          },
        };

        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret);
            if (ret.code === 200) {
              if (ret.data.length === 0) {
                _g.toast("暂无数据");
              } else {
                main.echartList = [];
                _g.toast(ret.message);
                ret.data.forEach(function (v, i) {
                  main.echartList.push({ eId: `main${i}`, value: v });
                });
                main.$nextTick(function () {
                  main.echartList.forEach(function (v) {
                    main.initEcharts(v);
                  });
                });
              }
            }
          },
        });
      },
      // 日期显示 - 不用动
      formatter(type, val) {
        if (type === "year") {
          return val+'年';
        } else if (type === "month") {
          return val+'月';
        }
        return val;
      },
      // 操作开始时间
      handlStartDate() {
        this.showDateStart = true;
      },
      openStartDate(val) {
        var newDate = Date.parse(new Date(val));
        this.startDate = new Date(newDate).Format("yyyy-MM");
        this.endDate = "";
        this.minEndDate = new Date(newDate);
        this.maxEndDate = new Date(new Date(newDate).Format("yyyy-12"));
        this.showDateStart = false;
      },
      closeStartDate() {
        this.showDateStart = false;
      },
      // 操作结束时间
      handlEndDate() {
        if (this.startDate) {
          this.showDateEnd = true;
        } else {
          _g.toast("请先选择开始时间");
        }
      },
      openEndDate(val) {
        var newDate = Date.parse(new Date(val));
        this.endDate = new Date(newDate).Format("yyyy-MM");
        this.showDateEnd = false;
        this.tableDate = this.endDate;
        this.get;
      },
      closeEndDate() {
        this.showDateEnd = false;
      },
      // 操作表格时间
      handlTableDate() {
        this.showDateTable = true;
      },
      openTableDate(val) {
        console.log(val);
        var newDate = Date.parse(new Date(val));
        this.tableDate = new Date(newDate).Format("yyyy-MM");
        this.datePicker = new Date(newDate).Format("MM");
        this.showDateTable = false;
        this.getTable();
      },
      closeTableDate() {
        this.showDateTable = false;
      },
      handlSearch() {
        if (this.startDate == "" || this.endDate == "") {
          _g.toast("请选择查询起止时间");
        } else {
          this.getBalanceList();
          this.getTable();
        }
      },
      // 选择导出方式
      onSelect(option) {
        // vant.toast(option.name);
        if (option.name == "图片") {
          this.getImg();
          this.showShare = false;
        }
        if (option.name == "表格") {
          this.exportExcel();
          this.showShare = false;
        }
      },
      // app生成图片
      getImg() {
        htmltoImage.init(
          {
            el: document.getElementById("table1"),
            isImageObject: true,
          },
          function (res, err) {
            if (res) {
              var base64Str1 = htmltoImage.cutprefixBase64(res.base64str);
              var trans = api.require("trans");
              trans.saveImage(
                {
                  base64Str: base64Str1,
                  album: true,
                  imgName: new Date().getTime() + ".png",
                },
                function (ret, err) {
                  if (ret.status) {
                    _g.toast(JSON.stringify(ret));
                  } else {
                    _g.toast(JSON.stringify(err));
                  }
                }
              );
            } else {
              _g.toast(JSON.stringify(err));
            }
          }
        );
      },
      // 导出Excel
      exportExcel() {
        if (this.whyList.length === 0) {
          _g.toast("暂无数据");
        } else {
          var url = "api/control/exportErp/exportExcel";
          var option = {
            data: {
              createHeader: true,
              tableName: "资产负债表",
              title:
                main.tableDate + "~" + _g.getLS("companyName") + "~资产负债表",
              list: main.whyList,
              sheetName: "表格1",
              fileName: "excelForm",
            },
          };
          Http.ajax({
            url: url,
            data: option,
            method: "post",
            isSync: false,
            isJson: true,
            lock: false,
            success: function (ret) {
              if (ret.code === 200) {
                _g.toast(ret.message);
                window.location.href = ret.data;
              }
            },
          });
        }
      },
      // 获取表格数据
      getTable() {
        var self = this;
        var url = "api/control/assetLiability/AssetLiabilitys";
        var option = {
          data: {
            selectDate: main.tableDate,
            deptId: main.deptId,
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code == 200) {
              main.whyList = ret.data;
              var arr = ret.data;
              if (arr.length === 0) {
                _g.toast("表格暂无数据");
                /* 啊啊啊 */
                self.whyList = [];
                self.fonetaryFund = ""; //货币资金
                self.transactionalFinancialAssets = ""; //交易性金融资产
                self.notesReceivable = ""; //应收票据
                self.accountsReceivable = ""; //应收账款
                self.prepayments = ""; //预付款项
                self.interestReceivable = ""; //应收利息
                self.dividendsReceivable = ""; //应收股利
                self.otherReceivables = ""; //其他应收款
                self.inventory = ""; //存货
                self.inventory1 = ""; //存货
                self.conCurrentAssets = ""; //一年内到期的非流动资产
                self.otherCurrentAssets = ""; //其他流动资产
                self.totalCurrentAssets = ""; //流动资产合计
                self.financialAssetsAvailable = ""; //可供出售金融资产
                self.maturityInvestments = ""; //持有至到期投资
                self.longTermReceivables = ""; //长期应收款
                self.longTermEquityInvestment = ""; //长期股权投资
                self.investmentProperty = ""; //投资性房地产
                self.fixedAssets = ""; //固定资产
                self.projectsUnderConstruction = ""; //在建工程
                self.engineeringMaterials = ""; //工程物资
                self.liquidationFixedAssets = ""; //固定资产清理
                self.productiveBiologicalAssets = ""; //生产性生物资产
                self.oilGasAssets = ""; //油气资产
                self.intangibleAssets = ""; //无形资产
                self.developmentExpenditure = ""; //开发支出
                self.goodwill = ""; //商誉
                self.longTermDeferredExpenses = ""; //长期待摊费用
                self.deferredTaxAssets = ""; //递延所得税资产
                self.otherNonCurrentAssets = ""; //其他非流动资产
                self.totalNonCurrentAssets = ""; //非流动资产合计
                self.totalAssets = ""; //资产总计
                self.shortTermBorrowing = ""; //短期借款
                self.tradingFinancialLiabilities = ""; //交易性金融负债
                self.notesPayable = ""; //应付票据
                self.accountsPayable = ""; //应付账款
                self.advanceReceipt = ""; //预收款项
                self.payrollPayable = ""; //应付职工薪酬
                self.taxPayable = ""; //应交税费
                self.payableInterest = ""; //应付利息
                self.dividendsPayable = ""; //应付股利
                self.otherPayables = ""; //其他应付款
                self.oneYearNonCurrentLiability = ""; //一年内到期的非流动负债
                self.otherCurrentLiability = ""; //其他流动负债
                self.totalFlowResponsibility = ""; //流动负责合计
                self.longTermLoan = ""; //长期借款
                self.bondsPayable = ""; //应付债券
                self.longTermPayable = ""; //长期应付款
                self.specialAccountPayable = ""; //专项应付款
                self.estimatedLiabilities = ""; //预计负债
                self.deferredIncomeTaxLiabilities = ""; //递延所得税负债
                self.otherNonCurrentLiabilities = ""; //其他非流动负债
                self.totalNonCurrentLiabilities = ""; //非流动负债合计
                self.totalLiabilities = ""; //负债总计
                self.paidInCapital = ""; //实收资本
                self.capitalReserve = ""; //资本公积
                self.treasuryStock = ""; //库存股
                self.earnedSurplus = ""; //盈余公积
                self.undistributedProfit = ""; //未分配利润
                self.totalOwnersEquity = ""; //所有者权益（或股东权益）合计
                self.totalLiabilitiesAndOwnerEquity = ""; //负债和所有者权益（或股东权益）总计
              } else {
                _g.toast(ret.message);
                console.log(arr[5].amtnqm);
                self.fonetaryFund = arr[5].amtnqm;
                self.transactionalFinancialAssets = arr[6].amtnqm;
                self.notesReceivable = arr[7].amtnqm;
                self.accountsReceivable = arr[8].amtnqm;
                self.prepayments = arr[9].amtnqm;
                self.interestReceivable = arr[10].amtnqm;
                self.dividendsReceivable = arr[11].amtnqm;
                self.otherReceivables = arr[12].amtnqm;
                self.inventory = arr[13].amtnqm;
                self.conCurrentAssets = arr[14].amtnqm;
                self.otherCurrentAssets = arr[15].amtnqm;
                self.totalCurrentAssets = arr[16].amtnqm;
                self.financialAssetsAvailable = arr[17].amtnqm;
                self.maturityInvestments = arr[18].amtnqm;
                self.longTermReceivables = arr[19].amtnqm;
                self.longTermEquityInvestment = arr[20].amtnqm;
                self.investmentProperty = arr[21].amtnqm;
                self.fixedAssets = arr[22].amtnqm;
                self.projectsUnderConstruction = arr[23].amtnqm;
                self.engineeringMaterials = arr[24].amtnqm;
                self.liquidationFixedAssets = arr[25].amtnqm;
                self.productiveBiologicalAssets = arr[26].amtnqm;
                self.oilGasAssets = arr[27].amtnqm;
                self.intangibleAssets = arr[28].amtnqm;
                self.developmentExpenditure = arr[29].amtnqm;
                self.goodwill = arr[30].amtnqm;
                self.longTermDeferredExpenses = arr[31].amtnqm;
                self.deferredTaxAssets = arr[32].amtnqm;
                self.otherNonCurrentAssets = arr[33].amtnqm;
                self.totalNonCurrentAssets = arr[34].amtnqm;
                self.totalAssets = arr[35].amtnqm;
                self.shortTermBorrowing = arr[36].amtnqm;
                self.tradingFinancialLiabilities = arr[37].amtnqm;
                self.notesPayable = arr[38].amtnqm;
                self.accountsPayable = arr[39].amtnqm;
                self.advanceReceipt = arr[40].amtnqm;
                self.payrollPayable = arr[41].amtnqm;
                self.taxPayable = arr[42].amtnqm;
                self.payableInterest = arr[43].amtnqm;
                self.dividendsPayable = arr[44].amtnqm;
                self.otherPayables = arr[45].amtnqm;
                self.oneYearNonCurrentLiability = arr[46].amtnqm;
                self.otherCurrentLiability = arr[47].amtnqm;
                self.totalFlowResponsibility = arr[48].amtnqm;
                self.longTermLoan = arr[49].amtnqm;
                self.bondsPayable = arr[50].amtnqm;
                self.longTermPayable = arr[51].amtnqm;
                self.specialAccountPayable = arr[52].amtnqm;
                self.estimatedLiabilities = arr[53].amtnqm;
                self.deferredIncomeTaxLiabilities = arr[54].amtnqm;
                self.otherNonCurrentLiabilities = arr[55].amtnqm;
                self.totalNonCurrentLiabilities = arr[56].amtnqm;
                self.totalLiabilities = arr[57].amtnqm;
                self.paidInCapital = arr[58].amtnqm;
                self.capitalReserve = arr[59].amtnqm;
                self.treasuryStock = arr[60].amtnqm;
                self.earnedSurplus = arr[61].amtnqm;
                self.undistributedProfit = arr[62].amtnqm;
                self.totalOwnersEquity = arr[63].amtnqm;
                self.totalLiabilitiesAndOwnerEquity = arr[64].amtnqm;
              }
            }
          },
        });
      },
    },
    filters: {
      NumFormat(value) {
        if (!value) return "";
        var intPart = Number(value) - (Number(value) % 1); //获取整数部分（这里是windy93的方法）
        var intPartFormat = intPart
          .toString()
          .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

        var floatPart = ".00"; //预定义小数部分
        var value2Array = value.toString().split(".");

        //=2表示数据有小数位
        if (value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分

          if (floatPart.length == 1) {
            //补0,实际上用不着
            return intPartFormat + "." + floatPart + "0";
          } else {
            return intPartFormat + "." + floatPart;
          }
        } else {
          return intPartFormat + floatPart;
        }
      },
    },
  });
  var _page = {
    initSwiper: function () {},
  };
  (function () {})();
  module.exports = {};
});

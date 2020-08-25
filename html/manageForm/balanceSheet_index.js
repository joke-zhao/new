define(function (require, exports, module) {
  var Http = require("U/http");

  var vant = require("L/vant/vant.min.js");

  var main = new Vue({
    el: "#main",
    components: { vant },
    template: _g.getTemplate("manageForm/balanceSheet_index_view"),
    data: {
      whyList:[],
      companyName:"",
      dialogShow: false,
      tableData: [],
      tableArr: [],
      startYear: "",
      endYear: "",
      datePicker: "",
      maxDate: new Date(),
      maxDate1: new Date(),
      // minDate:new Date() - 1,
      date1: "",
      show: false,
      show1: false,
      show2: false,
      currentDate: new Date(),
      value: "",
      value1: "",
      value2: "",
      // tableArr:[],
      detailsShow: false,
      detailsShowImg1: true,
      detailsShowImg2: false,
      dateNumberStart: "",
      dateNumberEnd: "",
      openDateNumberStart: false,
      openDateNumberEnd: false,
      deptName: "账王（广州）云科技有限公司", //公司名称
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
      //TODO Vant分享弹出框
      showShare: false,
      options: [
        { name: "图片", icon: "../../image/icon/image.png" },
        { name: "表格", icon: "../../image/icon/biao.png" },
        // { name: "pdf", icon: "../../image/icon/pdf.png" },
      ],
    },
    created: function () {
        this.deptId = _g.getLS("deptId");
        this.companyName = _g.getLS("companyName");
    },

    filters: {},
    mounted() {
      // var dom = document.getElementById("chartmain");
      // var myChart = echarts.init(dom);
      // var dom1 = document.getElementById("chartmain1");
      // var myChart1 = echarts.init(dom1);
      // var dom2 = document.getElementById("chartmain2");
      // var myChart2 = echarts.init(dom2);
      // var dom3 = document.getElementById("chartmain3");
      // var myChart3 = echarts.init(dom3);
      // var dom4 = document.getElementById("chartmain4");
      // var myChart4 = echarts.init(dom4);
      // var dom5 = document.getElementById("chartmain5");
      // var myChart5 = echarts.init(dom5);
      // var dom6 = document.getElementById("chartmain6");
      // var myChart6 = echarts.init(dom6);
      // var dom7 = document.getElementById("chartmain7");
      // var myChart7 = echarts.init(dom7);
      // var dom8 = document.getElementById("chartmain8");
      // var myChart8 = echarts.init(dom8);
      // var dom9 = document.getElementById("chartmain9");
      // var myChart9 = echarts.init(dom9);
      // var dom10 = document.getElementById("chartmain10");
      // var myChart10 = echarts.init(dom10);
      // var dom11 = document.getElementById("chartmain11");
      // var myChart11 = echarts.init(dom11);
      let now = new Date();
      console.log(now);
      var jackxb = [];
      var echar1 = [];
      var echar2 = [];
      var echar3 = [];
      var echar4 = [];
      var echar5 = [];
      var echar6 = [];
      var echar7 = [];
      var echar8 = [];
      var echar9 = [];
      var echar10 = [];
      var echar11 = [];
      var echar12 = [];
      var list = {};
      let startStr =
        now.getFullYear() +
        "-" +
        (now.getMonth() - 2 < 10
          ? "0" + (now.getMonth() - 2)
          : now.getMonth() - 2);
      let endStr =
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1);
      console.log(startStr, endStr);
      var self = this;
      console.log(self.value1, self.value2);

      var url = "api/control/assetLiability/Kpi";
      var a = {
        data: {
          curId: "CNY",
          deptName: self.deptId,
          // endDate: "2018-05",
          endDate: endStr,
          // selectDate: "null",
          startDate: startStr,
        },
      };

      Http.ajax({
        data: a,
        isFile: false,
        isJson: true,
        method: "post",
        isSync: false,
        lock: false,
        url: url,
        success: function (ret) {
          if (ret.code == 200) {
            console.log(ret, "获取到的数据");
            console.log(ret.data.length);
            for (var j = 0; j < ret.data.length; j++) {
              console.log(ret.data[j]);
              // console.log(ret.data[j].kmName);
              // console.log(ret.data[j].amtnqm);
              jackxb.push({
                value: ret.data[j].amtnqm,
                name: ret.data[j].kmName,
              });
            }
            console.log(jackxb);
            for (var i = 0; i < 4; i++) {
              echar1[i] = jackxb[i];
            }
            for (var k = 4; k < 8; k++) {
              echar2[k] = jackxb[k];
            }
            for (var ii = 8; ii < 12; ii++) {
              echar3[ii] = jackxb[ii];
            }
            for (var iii = 12; iii < 16; iii++) {
              echar4[iii] = jackxb[iii];
            }
            for (var iii = 16; iii < 20; iii++) {
              echar5[iii] = jackxb[iii];
            }
            for (var iii = 20; iii < 24; iii++) {
              echar6[iii] = jackxb[iii];
            }
            for (var iii = 24; iii < 28; iii++) {
              echar7[iii] = jackxb[iii];
            }
            for (var iii = 28; iii < 32; iii++) {
              echar8[iii] = jackxb[iii];
            }
            for (var iii = 32; iii < 36; iii++) {
              echar9[iii] = jackxb[iii];
            }
            for (var iii = 36; iii < 40; iii++) {
              echar10[iii] = jackxb[iii];
            }
            for (var iii = 40; iii < 44; iii++) {
              echar11[iii] = jackxb[iii];
            }
            for (var iii = 44; iii < 48; iii++) {
              echar12[iii] = jackxb[iii];
            }
            console.log(echar1);
            console.log(echar2);
            console.log(echar3);
            console.log(echar4);

            self.drawPieChart("chartmain", echar1);
            self.drawPieChart("chartmain1", echar2);
            self.drawPieChart("chartmain2", echar3);
            self.drawPieChart("chartmain3", echar4);
            self.drawPieChart("chartmain4", echar5);
            self.drawPieChart("chartmain5", echar6);
            self.drawPieChart("chartmain6", echar7);
            self.drawPieChart("chartmain7", echar8);
            self.drawPieChart("chartmain8", echar9);
            self.drawPieChart("chartmain9", echar10);
            self.drawPieChart("chartmain10", echar11);
            self.drawPieChart("chartmain11", echar12);
          }
        },
      });
    },
    methods: {
      // 点击打印
      handlPrint() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (
          bIsIpad ||
          bIsIphoneOs ||
          bIsMidp ||
          bIsUc7 ||
          bIsUc ||
          bIsAndroid ||
          bIsCE ||
          bIsWM
        ) {
          this.getImg()
        } else {
          this.print()
        }
      },
      // 打印
        print() {
            //获取打印内容最外层dom节点
            var bdHtml = document.getElementById("table1").innerHTML; //打印内容赋值innerHTML绘制新页面（window.print()打印当前页)
            console.log(bdHtml, "ajajajja");
            // return false
            window.document.body.innerHTML = bdHtml; //调用浏览器打印机
            window.print(); //刷新页面返回当前页
            location.reload();
        },
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
        //!导出Excel
      exportExcel() {
        var url = "api/control/exportErp/exportExcel";
        var option = {
          data: {
            createHeader: true,
            tableName:'资产负债表',
            title:main.value +'~'+ _g.getLS('companyName') + '~资产负债表',
            list: main.whyList,
            sheetName: "表格1",
            fileName: "1111",
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
            if(ret.code === 200){
              _g.toast(ret.message)
              window.location.href = ret.data
            }
          },
        });
      },
      //!导出图片
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
      //选择日期区间
      formatDate1(date1) {
        return `${date1.getMonth() + 1}/${date1.getDate()}`;
      },
      formatter(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      formatter2(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      //选择年月
      onConfirm(value) {
        // this.value = value;
        this.show = false;
        console.log(value);
        if (!value) {
          return "";
        } else {
          //   var date = new Date(date);
          //   var YY = date.getFullYear() + "/";
          //   var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/";
          //   var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          //   return YY + MM + DD;
          var m = value.getMonth() + 1;
          this.datePicker = m;
          var a = new Date(value).Format("yyyy-MM");
          console.log(a);
          this.value = a;
          var self = this;
          var deptName = this.deptName;
          var url = "api/control/assetLiability/AssetLiabilitys";
          var option = {
            data: {
              selectDate: a,
              deptName: self.deptId,
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
                _g.toast(ret.message);
                console.log(ret, "获取到的数据");
                console.log(
                  ret.data,
                  "1111111111111111111111111111111111111111111"
                );
                main.whyList = ret.data
                // setTimeout(function () {
                //   _g.closeWins("index-details");
                //   api.closeWin("index-details");
                // }, 2000);
                    var arr = ret.data;
                  if(arr.length === 0){
                    _g.toast('暂无数据')
                  }else{
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

          return a;
        }
      },
      drawPieChart(id, echartData) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            position: "right",
          },
          legend: {
            show: false,
          },
          // color: ["#efae25", "#f0f2f5"],
          series: [
            {
              name: "账款类型",
              type: "pie",
              radius: ["50%", "70%"],
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: "12",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: echartData,
            },
          ],
          graphic: [
            {
              type: "text",
              left: "center",
              top: "45%",
              style: {
                text: "账款",
                textAlign: "center",
                fill: "#ff0000",
                fontSize: 20,
                fontWeight: 10,
              },
            },
          ],
        };

        if (option && typeof option === "object") {
          myChart.setOption(option);
        }
      },
      //选择开始年月
      onConfirm1(value) {
        this.show1 = false;
        this.startYear = value.getFullYear();
        console.log(this.startYear);
        this.dateNumberStart = value.getMonth() + 1;
        console.log(this.dateNumberStart);
        var a = new Date(value).Format("yyyy-MM");
        console.log(a);
        this.value1 = a;
        // 1111111111111111111111111111111111111
        var b = this.value2;
        let now = new Date();
        console.log(now);
        var jackxb = [];
        var echar1 = [];
        var echar2 = [];
        var echar3 = [];
        var echar4 = [];
        var echar5 = [];
        var echar6 = [];
        var echar7 = [];
        var echar8 = [];
        var echar9 = [];
        var echar10 = [];
        var echar11 = [];
        var echar12 = [];
        let startStr =
          now.getFullYear() +
          "-" +
          (now.getMonth() - 2 < 10
            ? "0" + (now.getMonth() - 2)
            : now.getMonth() - 2);
        let endStr =
          now.getFullYear() +
          "-" +
          (now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1);
        console.log(startStr, endStr);
        var self = this;
        console.log(self.value1, self.value2);

        var url = "api/control/assetLiability/Kpi";
        var aaa = {
          data: {
            curId: "CNY",
            deptName: self.deptName,
            // endDate: "2018-05",
            endDate: b,
            // selectDate: "null",
            startDate: a,
          },
        };
        Http.ajax({
          data: aaa,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code == 200) {
              console.log(ret, "获取到的数据");
              for (var j = 0; j < ret.data.length; j++) {
                jackxb.push({
                  value: ret.data[j].amtnqm,
                  name: ret.data[j].kmName,
                });
              }
              console.log(jackxb);
              for (var i = 0; i < 4; i++) {
                echar1[i] = jackxb[i];
              }
              for (var k = 4; k < 8; k++) {
                echar2[k - 4] = jackxb[k];
              }
              for (var ii = 8; ii < 12; ii++) {
                echar3[ii - 8] = jackxb[ii];
              }
              for (var iii = 12; iii < 16; iii++) {
                echar4[iii - 12] = jackxb[iii];
              }
              for (var iii = 16; iii < 20; iii++) {
                echar5[iii - 16] = jackxb[iii];
              }
              for (var iii = 20; iii < 24; iii++) {
                echar6[iii - 20] = jackxb[iii];
              }
              for (var iii = 24; iii < 28; iii++) {
                echar7[iii - 24] = jackxb[iii];
              }
              for (var iii = 28; iii < 32; iii++) {
                echar8[iii - 28] = jackxb[iii];
              }
              for (var iii = 32; iii < 36; iii++) {
                echar9[iii - 32] = jackxb[iii];
              }
              for (var iii = 36; iii < 40; iii++) {
                echar10[iii - 36] = jackxb[iii];
              }
              for (var iii = 40; iii < 44; iii++) {
                echar11[iii - 40] = jackxb[iii];
              }
              for (var iii = 44; iii < 48; iii++) {
                echar12[iii - 44] = jackxb[iii];
              }
              console.log(echar1);
              console.log(echar2);
              console.log(echar3);
              console.log(echar4);
              self.drawPieChart("chartmain", echar1);
              self.drawPieChart("chartmain1", echar2);
              self.drawPieChart("chartmain2", echar3);
              self.drawPieChart("chartmain3", echar4);
              self.drawPieChart("chartmain4", echar5);
              self.drawPieChart("chartmain5", echar6);
              self.drawPieChart("chartmain6", echar7);
              self.drawPieChart("chartmain7", echar8);
              self.drawPieChart("chartmain8", echar9);
              self.drawPieChart("chartmain9", echar10);
              self.drawPieChart("chartmain10", echar11);
              self.drawPieChart("chartmain11", echar12);
            }
          },
        });
        return a;
      },
      //选择结束年月
      onConfirm2(value) {
        this.show2 = false;
        this.dateNumberEnd = value.getMonth() + 1;
        this.endYear = value.getFullYear();
        var a = new Date(value).Format("yyyy-MM");
        console.log(a);
        this.value2 = a;
        var b = this.value1;
        let now = new Date();
        console.log(now);
        var jackxb = [];
        var echar1 = [];
        var echar2 = [];
        var echar3 = [];
        var echar4 = [];
        var echar5 = [];
        var echar6 = [];
        var echar7 = [];
        var echar8 = [];
        var echar9 = [];
        var echar10 = [];
        var echar11 = [];
        var echar12 = [];
        let startStr =
          now.getFullYear() +
          "-" +
          (now.getMonth() - 2 < 10
            ? "0" + (now.getMonth() - 2)
            : now.getMonth() - 2);
        let endStr =
          now.getFullYear() +
          "-" +
          (now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1);
        console.log(startStr, endStr);
        var self = this;
        console.log(self.value1, self.value2);

        var url = "api/control/assetLiability/Kpi";
        var aaa = {
          data: {
            curId: "CNY",
            deptName: self.deptName,
            // endDate: "2018-05",
            endDate: a,
            // selectDate: "null",
            startDate: b,
          },
        };

        Http.ajax({
          data: aaa,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code == 200) {
              for (var j = 0; j < ret.data.length; j++) {
                jackxb.push({
                  value: ret.data[j].amtnqm,
                  name: ret.data[j].kmName,
                });
              }
              console.log(jackxb);
              for (var i = 0; i < 4; i++) {
                echar1[i] = jackxb[i];
              }
              for (var k = 4; k < 8; k++) {
                echar2[k - 4] = jackxb[k];
              }
              for (var ii = 8; ii < 12; ii++) {
                echar3[ii - 8] = jackxb[ii];
              }
              for (var iii = 12; iii < 16; iii++) {
                echar4[iii - 12] = jackxb[iii];
              }
              for (var iii = 16; iii < 20; iii++) {
                echar5[iii - 16] = jackxb[iii];
              }
              for (var iii = 20; iii < 24; iii++) {
                echar6[iii - 20] = jackxb[iii];
              }
              for (var iii = 24; iii < 28; iii++) {
                echar7[iii - 24] = jackxb[iii];
              }
              for (var iii = 28; iii < 32; iii++) {
                echar8[iii - 28] = jackxb[iii];
              }
              for (var iii = 32; iii < 36; iii++) {
                echar9[iii - 32] = jackxb[iii];
              }
              for (var iii = 36; iii < 40; iii++) {
                echar10[iii - 36] = jackxb[iii];
              }
              for (var iii = 40; iii < 44; iii++) {
                echar11[iii - 40] = jackxb[iii];
              }
              for (var iii = 44; iii < 48; iii++) {
                echar12[iii - 44] = jackxb[iii];
              }
              self.drawPieChart("chartmain", echar1);
              self.drawPieChart("chartmain1", echar2);
              self.drawPieChart("chartmain2", echar3);
              self.drawPieChart("chartmain3", echar4);
              self.drawPieChart("chartmain4", echar5);
              self.drawPieChart("chartmain5", echar6);
              self.drawPieChart("chartmain6", echar7);
              self.drawPieChart("chartmain7", echar8);
              self.drawPieChart("chartmain8", echar9);
              self.drawPieChart("chartmain9", echar10);
              self.drawPieChart("chartmain10", echar11);
              self.drawPieChart("chartmain11", echar12);
            }
          },
        });
        return a;
      },
      //
      showDetails() {
        this.detailsShow = !this.detailsShow;
        this.detailsShowImg1 = !this.detailsShowImg1;
        this.detailsShowImg2 = !this.detailsShowImg2;
      },
      //
      changeMon1() {
        console.log("sadasdasdasdasdas");
      },
      //
      changeMon2() {
        console.log("12388888");
      },
    },
    computed: {
      chooseMon1: function () {
        var d = new Date();
        console.log(d);
        var m1 = d.getMonth() + 1;
        var m2 = d.getMonth() - 2;
        var arr = [];
        // console.log(this.chooseMon2);
        console.log(this.dateNumberStart);
        console.log(this.dateNumberEnd);
        var mon1 = this.dateNumberStart;
        var mon2 = this.dateNumberEnd;
        var y1 = this.startYear;
        var y2 = this.endYear;
        console.log(mon1, mon2);
        if (this.value1 == "" || this.value2 == "") {
          for (var i = m2; i <= m1; i++) {
            arr.push(i);
          }
          console.log(arr);
        } else if (y1 > y2 && y1 != "" && y2 != "") {
          _g.toast("开始年份不能大于结束月份！");
        } else if (y1 == y2 && mon1 > mon2 && y1 != "" && y2 != "") {
          _g.toast("选择正确的月份！");
        } else if (y1 < y2 && y2 - y1 > 1 && y1 != "" && y2 != "") {
          _g.toast("选择正确的月份！1");
        } else if (y1 == "" || y2 == "") {
        } else if (
          y1 < y2 &&
          y2 - y1 == 1 &&
          y1 != "" &&
          y2 != "" &&
          mon1 < mon2
        ) {
          _g.toast("选择正确的月份！2");
        } else if (
          y1 < y2 &&
          y2 - y1 == 1 &&
          y1 != "" &&
          y2 != "" &&
          mon1 >= mon2
        ) {
          for (var i = mon1; i <= 12; i++) {
            arr.push(i);
          }
          for (var j = 1; j <= mon2; j++) {
            arr.push(j);
          }
        } else {
          for (var i = mon1; i <= mon2; i++) {
            arr.push(i);
          }
          console.log(arr);
        }
        return arr;
      },
    },
  });

  //   Vue.use(vant.Lazyload);
  var _page = {
    initSwiper: function () {
      var swiper = new Swiper(".swiper-container", {
        // direction: 'horizontal',
        // initialSlide: 0,
        // autoplay: 1000
        // autoplayStopOnLast: true
      });
      // var homeBanner = new Swiper('#banner', {
      //     direction: 'horizontal',
      //     loop: true,
      //     autoplay: 5000,
      //     pagination: '#banner .swiper-pagination',
      //     bulletActiveClass: 'is-active',
      //     autoplayDisableOnInteraction: false,
      //     onSliderMove: function () {
      //         api.setFrameAttr({
      //             name: 'home-index-frame',
      //             bounces: false
      //         });
      //     },
      //     onTouchEnd: function () {
      //         api.setFrameAttr({
      //             name: 'home-index-frame',
      //             bounces: true
      //         });
      //     },
      // })
    },
  };

  //_page.initSwiper();
  (function () {})();
  module.exports = {};
});

define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("addTaxpayer/addTaxpayer_manual_view"),
    data: {
      minDate: new Date(2000, 0, 1), // 日期范围
      showDate: false,
      name: "", //公司名称
      creditCode: "", //统一社会信用代码
      comType: "",
      recordDate: "",
      recordMoney: "",
      legalPeople: "",
      serverAddress: "",
      business: "",
      businessUrl: "",
      taxpayerType: "", //纳税人类型
      industryId: "", //行业类型id
      //!纳税人类型
      value1: "",
      TaxpayerIndex: 0,
      taxpayerPicker: false,
      taxpayer: ["小规模纳税人", "一般纳税人"],
      //!税率选择器
      value2: "",
      valueShow2: "",
      ratePicker: false,
      // rate: ["0%", "1%", "2%", "3%", "5%", "6%", "9%", "10%", "11%", "13%"],
      rate: [
        {text:'0%',value:0.00},
        {text:'1%',value:0.01},
        {text:'2%',value:0.02},
        {text:'3%',value:0.03},
        {text:'5%',value:0.05},
        {text:'6%',value:0.06},
        {text:'9%',value:0.09},
        {text:'10%',value:0.10},
        {text:'11%',value:0.11},
        {text:'13%',value:0.13}
      ],
      //!所属行业
      value3: "",
      industryPicker: false,
      timer2:null,
      industry: [],

      //!行业类型
      value4: "",
      industryTypePicker: false,
      industryType: ["贸易类", "制造类", "服务类", "工程类", "其他类","研发类"],
      //!主要产品或服务
      prod: "",
      prodList: [],
      showProd: false,
      timer: null,
    },
    created: function () {},
    filters: {},
    methods: {
      //!纳税人类型选择器
      onTaxpayer(value, index) {
        this.value1 = value;
        this.TaxpayerIndex = Number(index + 1);
        console.log(this.TaxpayerIndex)
        this.taxpayerPicker = false;
      },
      //!税率选择器
      onRate(data) {
        console.log(data,"jjjjjj")
        this.value2 = data.value;
        this.valueShow2 = data.text
        this.ratePicker = false;
      },
      //!所属行业
      onIndustry(value) {
        this.value3 = value;
        this.industryPicker = false;
      },
      //!行业类型
      onIndustryType(value) {
        this.value4 = value;
        this.industryTypePicker = false;
      },
      delayed() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          main.getProd();
        }, 1200);
      },
      delayed2() {
        if (this.timer2) {
          clearTimeout(this.timer2);
          this.timer2 = null;
        }
        this.timer2 = setTimeout(() => {
          main.getindustry();
        }, 1200);
      },
      // 模糊搜索行业类型
      getindustry() {
        console.log("搜索");
        if (!this.value3) {
          this.industryPicker = false;
        } else {
          var self = this;
          var url = "api/control/erppage/selectInList?name=" + this.value3;
          Http.ajax({
            url: url,
            data: {},
            method: "post",
            isSync: true,
            isJson: true,
            lock: false,
            success: function (ret) {
              console.log(ret, "公司数据");
              self.industry = [];
              if (ret.code === 200) {
                main.industry = ret.data;
                if (main.industry.length == 0) {
                  _g.toast("未找到所属行业");
                  self.industryPicker = false;
                } else {
                  self.industryPicker = true;
                }
              }
            },
          });
        }
      },
      // 模糊搜索产品或服务
      getProd() {
        console.log("搜索");
        if (!this.prod) {
          this.showProd = false;
        } else {
          var self = this;
          var url = "api/control/erppage/selectProdList?name=" + this.prod;
          Http.ajax({
            url: url,
            data: {},
            method: "post",
            isSync: true,
            isJson: true,
            lock: false,
            success: function (ret) {
              console.log(ret, "公司数据");
              self.prodList = [];
              if (ret.code === 200) {
                main.prodList = ret.data;
                if (main.prodList.length == 0) {
                  _g.toast("未找到该产品或服务");
                  self.showProd = false;
                } else {
                  self.showProd = true;
                }
              }
            },
          });
        }
      },
      onProd(value) {
        this.prod = value;
        this.showProd = false;
      },
      // 选择日期
      onDate(date) {
        this.showDate = false;
        this.recordDate = date.getTime();
      },
      submit() {
        if (!main.serverAddress) {
          _g.toast("住所地址不能为空");
        } else if(!main.name){
          _g.toast('名称不能为空')
        }else if(!main.creditCode){
          _g.toast('统一社会信用代码不能为空')
        }else if(!main.comType){
          _g.toast('企业类型不能为空')
        }else if(!main.recordDate){
          _g.toast('注册日期不能为空')
        }else if(!main.recordMoney){
          _g.toast('注册资本不能为空')
        }else if(!main.legalPeople){
          _g.toast('法定代表人不能为空')
        }else if(!main.business){
          _g.toast('经营范围不能为空')
        }else if(!main.TaxpayerIndex){
          _g.toast('纳税人类型不能为空')
        }else if(main.value2  === ''){
          _g.toast('基本税率不能为空')
        }else if(!main.value3){
          _g.toast('所属行业不能为空')
        }else if(!main.value4){
          _g.toast('行业类型不能为空')
        }else if(!main.prod){
          _g.toast('所属产品或服务不能为空')
        }else{
          var bMap = api.require("bMap");
          bMap.getCoordsFromName(
            {
              address: main.serverAddress,
            },
            function (ret, err) {
              if (ret.status) {
                var url = "api/control/beatCompany/create";
                var userId = _g.getLS("userId");
                var option = {
                  data: {
                    name: main.name,
                    creditCode: main.creditCode,
                    companyType: main.comType,
                    recordDate: main.recordDate,
                    recordMoney: main.recordMoney,
                    legalPeople: main.legalPeople,
                    serverAddress: main.serverAddress,
                    business: main.business,
                    taxpayerType: main.TaxpayerIndex, //纳税人类型
                    baseTax:main.value2,
                    industryId: main.value3, //所属行业类型
                    industryTypeId: main.value4, //行业类型id
                    mainProject: main.prod,
                    userId: userId,
                    longitude: ret.lon, //经度
                    latitude: ret.lat, //纬度

                    // longitude:11.35325252525,//经度
                    // latitude: 57.446464646,//纬度
                  },
                };
                Http.ajax({
                  url: url,
                  data: option,
                  method: "post",
                  isSync: true,
                  isJson: true,
                  lock: false,
                  success: function (ret) {
                    if (ret.code == 200) {
                      _g.toast(ret.message);
                      setTimeout(function () {
                        api.closeWin();
                        
                      }, 800);
                    }
                    console.log(ret, "返回值");
                  },
                });
              }else{
                _g.toast('请填写正确地址')
              }
            }
          );
        }
      },
    },
    components: {
      vant,
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

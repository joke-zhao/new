define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIncome/myIncome_index_view"),
    data: {
      isActive: 1,
      tabs: [
        { id: 1, name: "总收入" },
        { id: 2, name: "代理" },
        { id: 3, name: "分享" },
        { id: 4, name: "服务" },
      ],
      agencyInfo: {
        sum: 0, //代理收入
        inventory: 0, //存货额
        invenMd: 0, //存货MD
        remain: 0, //剩余MD
      },
      shareInfo: {
        sum: 0, //分享收入
        packageMeal: 0, //分享套餐
        course: 0, //分享课程
        business: 0, //分享服务
      },
      serveInfo: {
        sum: 0, //服务总收入
        business: 0, //工商
        errands: 0, //跑腿
      },
      incomeSum: 0, //总收入
      daiIncome: 0, //代理收入
      shareIncome: 0, //分享收入
      team: 0, //团队奖
      range: 0, //级差将
      serverIncome: 0, //服务收入
      shareCombo: 0, //分享套餐
      shareCourse: 0, //分享课程
      serverIndustry: 0, //服务工商
      serverErrand: 0, //服务跑腿
      mdCount: 0, //剩余md数
    },
    created: function () {
      this.getUserIncomeSum(); // 获取用户的收入信息
    },
    methods: {
      // 切换tabs
      changeTabs(id) {
        if (id === this.isActive) return;
        this.isActive = id;
      },
      //查询用户收入
      getUserIncomeSum() {
        var url = "api/control/beatIncomeDetail/selectBeatIncomeDetail";
        var option = {
          data: {
            userId: _g.getLS("userId"),
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
            console.log(ret);
            if (ret.code === 200) {
              main.incomeSum = ret.data.incomeSum //总收入
              main.daiIncome = ret.data.daiIncome //代理收入
              main.shareIncome = ret.data.shareIncome //分享收入
              main.team = ret.data.team
              main.range = ret.data.range
              main.serverIncome = ret.data.serverIncome //服务收入
              main.shareCombo = ret.data.shareCombo
              main.shareCourse = ret.data.shareCourse
              main.serverIndustry = ret.data.serverIndustry
              main.serverErrand = ret.data.serverErrand
              main.mdCount = ret.data.mdCount
            }
          },
        });
      },
      // 获取代理收入信息
      getAgencyInfo() {
        var url = "api/control/beatAgencyIncome/viewBeatAgencyIncome";
        var option = {
          data: {
            userId: _g.getLS("userId"),
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
            console.log(ret, "获取代理收入信息");
            if (ret.code === 200) {
              if (ret.data) {
                main.agencyInfo = ret.data;
              }
            }
          },
        });
      },
      // 获取分享收入信息
      getShareInfo() {
        var url = "api/control/beatShareIncome/viewBeatShareIncome";
        var option = {
          data: {
            userId: _g.getLS("userId"),
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
            console.log(ret, "获取分享收入信息");
            if (ret.code === 200) {
              if (ret.data) {
                main.shareInfo = ret.data;
              }
            }
          },
        });
      },
      // 获取服务收入信息
      getServeInfo() {
        var url = "api/control/beatServiceIncome/viewBeatServiceIncome";
        var option = {
          data: {
            userId: _g.getLS("userId"),
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
            console.log(ret, "获取服务收入信息");
            if (ret.code === 200) {
              if (ret.data) {
                main.serveInfo = ret.data;
              }
            }
          },
        });
      },

      // 打开收入明细
      openDetail() {
        _g.openWin({
          header: { title: "收入明细" },
          name: "index_detail",
          url: "../myIncome/index_detail_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开收入明细
      openBoss() {
        _g.openWin({
          header: { title: "我邀请的boss" },
          name: "index_boss",
          url: "../myIncome/index_boss_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的下级代理
      openAgency() {
        _g.openWin({
          header: { title: "我的下级代理" },
          name: "index_boss",
          url: "../myIncome/index_agency_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
    },
    filters: {
      formatDate(date) {
        if (!date) {
            return '暂无时间';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd hh:mm:ss")
          return a
        }
      },
  },
  });
  (function () {})();
  module.exports = {};
});

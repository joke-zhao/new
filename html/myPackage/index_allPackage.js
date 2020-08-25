define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myPackage/index_allPackage_view"),
    data: {
      OrgList: [], //公司列表
      packageList: [], //我的套餐列表
      payShow: false, //支付弹框
      swiperId: 0, //当前展示套餐索引
      payFlag: 0, //支付方式标志
      companyIdList: [], //选择支付公司id列表
      payList: [
        { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
        { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
      ], //支付方式
      totalPrice: 0, //总价
    },
    created: function () {
      this.getAllPackage();
      this.getCompanyList();
    },
    methods: {
      // 查看所有套餐
      getAllPackage() {
        var url = "api/control/beatPackage/viewAll";
        var option = {
          data: {},
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
            console.log(ret);
            main.packageList = ret.data;
          },
        });
      },
      // 点击立即支付 - 调起支付弹窗
      handlePay() {
        this.totalPrice =
          this.packageList[this.swiperId].packagePrice *
          this.companyIdList.length;
        // this.totalPrice = 0.01; // 测试给1分钱 单位是元
        console.log(JSON.stringify(this.companyIdList), "公司id列表");
        if (this.companyIdList.length === 0) {
          _g.toast("请选择购买公司");
        } else {
          this.payShow = true;
        }
      },
      // 选择支付方式
      handlePayType() {
        if (this.payFlag === 0) {
          _g.toast("请选择支付方式");
        } else if (this.payFlag === 1) {
          main.wxPay(this.totalPrice); //微信支付
        } else {
          this.getPayInfo(2, this.totalPrice); //支付宝支付
        }
        console.log(this.packageList[this.swiperId], "当前套餐信息");
      },
      // 根据支付方式唤起App
      getPayInfo(payType, totalPrice) {
        var url = "pay/appPay";
        var option = {
          data: {
            payStatus: payType,
            money: totalPrice,
            payNum: this.packageList[this.swiperId].id,
            status: "购买套餐",
            userId: _g.getLS("userId"),
          },
        };
        Http.ajax({
          url: url,
          data: option,
          method: "post",
          isJson: true,
          isSync: false,
          lock: true,
          success: function (ret) {
            console.log(ret, "获取订单信息");
            if (ret.code === 200) {
              // if(payType === 1){
              // main.wxPay(ret.data)
              // }else{
              main.aLiPay(ret.data);
              // }
            } else {
              main.reSetData();
              _g.toast("下单失败");
            }
          },
        });
      },
      // 支付宝支付
      aLiPay(payData) {
        var aliPayPlus = api.require("aliPayPlus");
        aliPayPlus.payOrder(
          {
            orderInfo: payData.pay,
          },
          function (ret, err) {
            var msg = ret.code;
            //9000：支付成功
            if (ret.code === "9000") {
              msg = "购买成功，购买后首次上传单据即生效";
              // 支付成功 提交订单 传递消费记录id
              main.submitOrder(payData.id);
            }
            //8000：正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
            if (ret.code === "8000") {
              msg = "正在处理中...请稍后";
            }
            //4000：订单支付失败
            if (ret.code === "4000") {
              msg = "订单支付失败";
            }
            //5000：重复请求
            if (ret.code === "5000") {
              msg = "重复请求";
            }
            //6001：用户中途取消支付操作
            if (ret.code === "6001") {
              msg = "用户中途取消支付操作";
            }
            //6002：网络连接出错
            if (ret.code === "6002") {
              msg = "网络连接出错";
            }
            //6004：支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
            if (ret.code === "6004") {
              msg = "支付结果未知";
            }
            api.alert({
              title: "支付结果",
              msg: msg,
              buttons: ["确定"],
            });
          }
        );
      },
      // 微信支付
      wxPay(totalPrice) {
        var url =
          "wxPay/unifiedOrder?" +
          "amount=" +
          totalPrice +
          "&body=购买套餐"+
          "&orderNo=" +'3838358383'
        Http.ajax({
          url: url,
          data: {},
          method: "get",
          isJson: true,
          isSync: false,
          lock: true,
          success: function (ret) {
            alert(JSON.stringify(ret))
            if (ret["msg"] === "success") {
              var wxPayPlus = api.require("wxPayPlus");
              wxPayPlus.payOrder(
                {
                  apiKey: ret['data']['appid'],
                  orderId: ret['data']['prepayid'], // 订单id
                  mchId: ret['data']['partnerid'], // 商户号，调用接口提交的商户号
                  nonceStr: ret['data']['noncestr'], // 随机字符串
                  timeStamp:  ret['data']['timestamp'], // 事件戳
                  package: 'Sign=WXPay',
                  sign: ret['data']['sign'], // 签名

                  // apiKey: "wxfe12afb78ada060a",
                  // orderId: "wx12205043999118d70ac5daeed69f2c0000",
                  // mchId: "1563294201",
                  // nonceStr: "2f2f2d29b22344c58306e30d0248821a",
                  // timeStamp: "1597299381",
                  // package: "Sign=WXPay",
                  // sign: "FD7531E1C42BFB6F2B6F565AAB585C4D",
                },
                function (ret, err) {
                  alert(JSON.stringify(ret));
                  alert(JSON.stringify(err));
                  if (ret.status) {
                    //支付成功
                  }
                }
              );
            }else{
             _g.toast(ret['msg'])
             main.reSetData()
            }
          },
        });
      },
      // 购买套餐
      submitOrder(eId) {
        var pData = main.packageList[this.swiperId]; //当前套餐
        console.log(pData, "当前套餐");
        var url = "api/control/beatPackageOrder/create";
        var options = {
          data: {
            company: main.companyIdList.toString(), //购买公司id列表
            userId: _g.getLS("userId"),
            declare: pData.reportCount, //报税数量
            mdCount: pData.mdCount,
            id: eId, //消费记录id
            packageId: pData.id, //购买套餐id
            receipts: pData.uploadCount, //上传单据数量
            totalPrice: main.totalPrice, //总价
          },
        };
        // return false
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: true,
          url: url,
          success: function (ret) {
            console.log(ret, "购买套餐");
            if (ret.code === 200) {
              api.closeWin();
              _g.execScript({
                winName: "myPackage-index-win",
                frameName: "myPackage-index-frame",
                fnName: "UpdatePackageFn",
              });
            } else {
              main.reSetData(); //重置页面状态
              _g.toast(ret.message);
            }
          },
        });
      },
      // 重置页面 支付弹框 总价 支付方式 选择公司id列表
      reSetData() {
        this.companyIdList = [];
        this.payData = 0;
        this.payShow = false;
        this.totalPrice = 0;
      },
      // 打开套餐(佣金)规则
      openRule() {
        _g.openWin({
          header: { title: "佣金规则" },
          name: "index_rule",
          url: "../myPackage/index_rule_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //  获取公司列表
      getCompanyList() {
        var self = this;
        var url = "api/control/beatCompany/handleCompany";
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
            if (ret.code === 200) {
              ret.data.forEach(function (item) {
                main.OrgList.push({ text: item.name, value: item.id });
              });
              console.log(main.OrgList, "公司列表");
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
    },
    components: { vant },
    filters: {},
  });
  var _page = {
    initSwiper: function () {
      new Swiper("#swiper", {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        autoplay: false,
        loop: false, // 循环模式选项
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
        onSlideChangeStart: function (swiper) {
          //Swiper初始化了
          main.swiperId = swiper.activeIndex;
          console.log(main.swiperId); //提示Swiper的当前索引
        },
      });
    },
  };
  _page.initSwiper();
  (function () {})();
  module.exports = {};
});

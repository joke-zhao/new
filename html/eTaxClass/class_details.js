define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("eTaxClass/class_details_view"),
    data: {
      classList: [],//课程详情
      commentList: [],//评论列表
      flag: 1,
      searchVal: "",//评论输入框
      payList: [
        { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
        { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
      ], //支付方式
      payShow: false, //支付弹框
      payFlag: 0, //支付方式标志
    },
    created: function () {
      this.selectClassDetails();
      // this.selectCommentList();
    },
    components: {
      vant,
    },
    methods: {
      // tab点击
      handleTab(val) {
        this.flag = val;
        if (this.flag === 2) {
          this.selectCommentList();
        }
      },
      //查询课程详情
      selectClassDetails() {
        var url = "api/control/beatCourse/viewBeatCourse";
        var option = {
          data: {
            id: api.pageParam.classId,
            userId: _g.getLS("userId")
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: false,
          success: function (ret) {
            if (ret.code === 200) {
              main.classList = ret.data
            }
          }
        })
      },
      //根据课程id查询评论列表
      selectCommentList() {
        var url = "api/control/beatComment/selectCommentList";
        var option = {
          data: {
            id: api.pageParam.classId
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: false,
          success: function (ret) {
            if (ret.code === 200) {
              main.commentList = ret.data
            }
          }
        })
      },
      //点赞
      createBeatUserLike() {
        var url = "api/control/beatUserLike/createBeatUserLike";
        var option = {
          data: {
            likeId: api.pageParam.classId,//被点赞的id 如电子书id或课程id回答id智能id等
            type: 1,//1课程 2电子书 3回答id 4智能
            userId: _g.getLS("userId")
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: true,
          success: function (ret) {
            main.selectClassDetails();
          }
        })
      },
      //发表评论
      insertCourseComment() {
        if (main.searchVal != "") {
          var url = "api/control/beatCourse/insertCourseComment";
          var option = {
            data: {
              commentId: api.pageParam.classId,
              content: main.searchVal,
              createTime: new Date(),
              nickname: _g.getLS("nickName"),
              userId: _g.getLS("userId"),
              userPhoto: _g.getLS("photoUrl")
            }
          }
          Http.ajax({
            url: url,
            data: option,
            method: 'post',
            isSync: true,
            isJson: true,
            lock: true,
            success: function (ret) {
              if (ret.code === 200) {
                main.searchVal = "";
                _g.toast("发表成功!");
                main.selectCommentList();
              }
            }
          })
        } else {
          _g.toast("请输入要发表的内容！")
        }
      },
      // 选择支付方式
      handlePayType() {
        if (this.payFlag === 0) {
          _g.toast("请选择支付方式");
        } else if (this.payFlag === 1) {
          console.log("微信支付");
          this.getPayInfo(1,this.classList.money);
        } else {
          console.log("支付宝支付");
          this.getPayInfo(2,this.classList.money);
        }
      },
      // 根据支付方式唤起App
      getPayInfo(payType,totalPrice){
        var url = "pay/appPay";
        var option = {
          data: {
            money: totalPrice,//金额元
            payStatus: payType,//支付类型1微信2支付宝
            payNum: api.pageParam.classId,//购买对象的id
            status: "购买课程",//消费类型
            userId: _g.getLS("userId"),//用户id
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: true,
          isJson: true,
          lock: true,
          success: function (ret) {
            if(payType === 1){
              main.wxPay(ret.data)
            }else{
              main.aLiPay(ret.data)
              // main.submitOrder()
            }
          }
        })
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
              msg = "支付成功";
              // 支付成功 提交订单 传递消费记录id
              main.selectClassDetails();
              main.payShow = false
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
      getAll(index) {
        if (this.commentList[index].id === 0) {
          this.commentList[index].id = 1
        } else {
          this.commentList[index].id = 0
        }
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

  (function () { })();
  module.exports = {};
});

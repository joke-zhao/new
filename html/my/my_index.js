define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("my/my_index_view"),
    data: {
      typeShow: 1, //根据登陆者类型进行部分功能的显示隐藏,
      companyName: "", //公司名称
      roleName: "",
      userName: "",
      photoUrl: "",
      showDialog: false,
      UnreadCount:0,//消息未读总数
      incomeSum:0, //总收入
      integralTotal:0, //用户积分
      balance: 0
    },
    created: function () {
      this.selectChatUnreadCount();
      this.getUser();
      this.getSurplus()
      this.getUserIncomeSum()
      this.getUserIntegral()
      // 页面返回刷新
      window.UpdateNameFn = function () {
        main.getUser();
      };
    },
    filters: {},
    methods: {
      openMyCustomer() {
        _g.openWin({
          header: { title: "我的客户" },
          name: "my-customer",
          url: "../my/my_customer_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },

      openMessage() {
        _g.openWin({
          header: { title: '消息列表' },
          name: "message-list",
          url: "../message/myMessage_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
          } //携参
        })
      },
      //查询聊天未读总数
      selectChatUnreadCount() {
        var url = "api/control/beatChat/selectChatUnreadCount";
        var option = {
          data: {
            userId: _g.getLS("userId")
          },
        }
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code === 200) {
              main.UnreadCount = ret.data;
            }
          },
        });
      },
      //查询用户收入
      getUserIncomeSum() {
        var url = "api/control/beatIncomeDetail/selectBeatIncomeDetail";
        var option = {
          data: {
            userId: _g.getLS("userId")
          },
        }
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code === 200) {
              main.incomeSum = ret.data.incomeSum; //总收入
            }
          },
        });
      },
      // 获取用户当前总积分
      getUserIntegral() {
        var url = "api/control/beatPointsRecord/integralForAppSum";
      var option = {
        data: {
          userId: _g.getLS("userId"),
        }
      }
      Http.ajax({
        data: option,
        isFile: false,
        isJson: true,
        method: "post",
        isSync: true,
        lock: false,
        url: url,
        success: function (ret) {
          console.log(ret,'用户积分')
          if(ret.code === 200){
            main.integralTotal = ret.data
          }
        }
      })
    },
    openMyService() {
      _g.openWin({
        header: { title: "我的服务" },
        name: "my-service",
        url: "../my/my_service_frame.html",
        bounces: false,
        slidBackEnabled: false,
        bgColor: "#fff",
        pageParam: {}, //携参
      });
    },
    openMyClass() {
      _g.openWin({
        header: { title: "我的课程" },
        name: "my-class",
        url: "../my/my_class_frame.html",
        bounces: false,
        slidBackEnabled: false,
        bgColor: "#fff",
        pageParam: {}, //携参
      });
    },
      getUser() {
        (this.typeShow = Number(_g.getLS("roleId"))),
          (this.roleName = _g.getLS("roleName"));
        this.companyName = _g.getLS("companyName");
        this.userName = _g.getLS("nickName");
        this.photoUrl = _g.getLS("photoUrl");
      },
        getSurplus() {
            Http.ajax({
                data: {
                    data: {
                        //_g.getLS('userId')
                        //4028818b7356d292017356dc06080010,001
                        userId: _g.getLS('userId')
                    }
                },
                isJson: true,
                method: "post",
                isSync: true,
                lock: false,
                url: 'api/control/beatUser/userInfo',
                success: result => {
                    if (result.code === 200) {
                        this.balance = result.data.userInfo.balance === null ? 0 : result.data.userInfo.balance
                    }
                }
            })
        },
      // 我的页面
      // 登录角色为 服务商端-自由职业者时  隐藏：待评价 12个服务类型
      // 登录角色为 纳税人端时 隐藏：我的服务、我的客户 10个服务类型
      onPicTap: function () {
        _g.execScript({
          winName: _g.getLS("rootWinName"),
          fnName: "reloadApp",
        });
      },
      // 打开全部订单页面
      openMyOrder() {
        if(Number(_g.getLS('roleId'))>2){
            _g.openWin({
              header: { title: "全部订单" },
              name: "myOrder-service",
              url: "../myOrder/myOrder_service_frame.html",
              bounces: false,
              slidBackEnabled: false,
              bgColor: "#fff",
              pageParam: {}, //携参
          });
        }
        else{
            _g.openWin({
                header: { title: "全部订单" },
                name: "myOrder-taxPayer",
                url: "../myOrder/myOrder_taxPayer_frame.html",
                bounces: false,
                slidBackEnabled: false,
                bgColor: "#fff",
                pageParam: {}, //携参
            });
        }

      },
      // 打开我的套餐页面
      openMyPackage() {
        _g.openWin({
          header: { title: "我的套餐" },
          name: "myPackage-index",
          url: "../myPackage/myPackage_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的单据页面
      openMyBills() {
        _g.openWin({
          header: { title: "我的单据" },
          name: "myBills-index",
          url: "../myBills/myBills_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的问答
      openMyAskAnswer() {
        _g.openWin({
          header: { title: "我的问答" },
          name: "myAskAnswer-index",
          url: "../myAskAnswer/myAskAnswer_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的我要合作
      openCooperation() {
        _g.openWin({
          header: { title: "我要合作" },
          name: "myCooperation-index",
          url: "../cooperation/cooperation_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的反馈意见
      openMyFeedback() {
        _g.openWin({
          header: { title: "反馈意见" },
          name: "myFeedback-index",
          url: "../myFeedback/myFeedback_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的关于我们
      openAboutUs() {
        _g.openWin({
          header: { title: "关于我们" },
          name: "myAboutUs-index",
          url: "../mySet/aboutUs_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的设置界面
      openMySet() {
        _g.openWin({
          header: { title: "设置" },
          name: "mySet-index",
          url: "../mySet/mySet_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开积分页面
      openIntegral() {
        _g.openWin({
          header: { title: "积分" },
          name: "myIntegral-index",
          url: "../myIntegral/myIntegral_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开我的收入
      openIncome() {
        _g.openWin({
          header: { title: "我的收入" },
          name: "myIncome-index",
          url: "../myIncome/myIncome_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      //打开余额页面
      openSurplus() {
        _g.openWin({
          header: { title: "余额" },
          name: "surplus",
          url: "../my/surplus_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开开票页面
      openMakeInvoices() {
        _g.openWin({
          header: { title: "开票" },
          name: "makeInvoices-index",
          url: "../makeInvoices/makeInvoices_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开税务页面
      openTaxation() {
        _g.openWin({
          header: { title: "税务" },
          name: "taxation-index",
          url: "../my/my_taxation_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
    },
  });

  (function () { })();
  module.exports = {};
});

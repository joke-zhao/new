define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/mySet_index_view"),
    data: {
      roleId:'',
      isActive: false, //自动审批状态 默认关闭
      flag: false,
      value1: "采购发票",
      poList: [
        { text: "采购发票", value: "采购发票" },
        { text: "采购入库单", value: "采购入库单" },
      ],
      value2: "销售发票",
      marketList: [
        { text: "销售发票", value: "销售发票" },
        { text: "销售入库单", value: "销售入库单" },
      ],
      value3: "自动报税",
      applyList: [
        { text: "自动报税", value: "自动报税" },
        { text: "手动报税", value: "手动报税" },
      ],
    },
    created: function () {
      this.getUserInfo();
      this.roleId = _g.getLS('roleId')
    },
    filters: {},
    methods: {
      // 自动审批切换
      changeAutoBtn(status) {
          if(status){
              this.openAuto()
          }else{
              this.closeAuto()
          }
      },
      // 关闭自动审批
      closeAuto() {
        var url = "api/control/beatUser/disableApproval";
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
          lock: true,
          url: url,
          success: function (ret) {
            if (ret.code === 200) {
              _g.toast("自动审批已关闭");
            }
          },
        });
      },
      // 开启自动审批
      openAuto() {
        var url = "api/control/beatUser/enableApproval";
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
          lock: true,
          url: url,
          success: function (ret) {
            if (ret.code === 200) {
              _g.toast("自动审批已开启");
            }
          },
        });
      },
      // 获取用户的信息 - 查询
      getUserInfo() {
        var self = this;
        var url = "api/control/beatUser/userInfo";
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
            if (ret.code === 200) {
              main.isActive = ret.data.userInfo.autoApproval;
            }
          },
        });
      },
      outLogin() {
        _g.openWin(
          {
            name: "login-index",
            url: "../../html/login/index_frame.html",
            bounces: false,
            slidBackEnabled: false,
            animation: {
              type: "none",
            },
          },
          "normal"
        );
        api.closeFrameGroup({
          name: "main-group",
        });

        localStorage.clear();
        // $api.clearStorage();
        _g.clearLS();
        api.rebootApp();
        // 获取状态栏高度, 并设置至缓存
        var StatusBarHeight = _g.getStatusBarHeight();
        _g.setLS("StatusBarHeight", StatusBarHeight);
      },
      // 打开账号与安全
      openSafety() {
        _g.openWin({
          header: { title: "账号与安全" },
          name: "safety-index",
          url: "../safety/safety_index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开个人信息
      openUserInfo() {
        var roleId = _g.getLS("roleId");
        // 服务商的信息页
        if (roleId === "3" || roleId === "4") {
          _g.openWin({
            header: { title: "服务商信息" },
            name: "index-serveInfo",
            url: "../mySet/index_serveInfo_frame.html",
            bounces: false,
            slidBackEnabled: false,
            bgColor: "#fff",
            pageParam: {}, //携参
          });
        } else {
          // 纳税人的信息页
          _g.openWin({
            header: { title: "个人信息" },
            name: "index-userInfo",
            url: "../mySet/index_userInfo_frame.html",
            bounces: false,
            slidBackEnabled: false,
            bgColor: "#fff",
            pageParam: {}, //携参
          });
        }
      },
      // 打开企业信息
      openEnterInfo() {
        _g.openWin({
          header: { title: "企业信息" },
          name: "index-enterInfo",
          url: "../mySet/index_enterInfo_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开查看企业员工
      openEnterStaff() {
        _g.openWin({
          header: { title: "企业员工" },
          name: "index-enterStaff",
          url: "../mySet/index_enterStaff_frame.html",
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

  (function () {})();
  module.exports = {};
});

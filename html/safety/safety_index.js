define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("safety/safety_index_view"),
    data: {
      phone:"",
      userId:'',
    },
    created: function () {
      this.phone = _g.getLS('userPhone')
      this.userId = _g.getLS('userId')
    },
    filters: {},
    methods: {
      // 打开修改密码页面
      openChangePassword(){
        _g.openWin({
          header: { title: "修改密码" },
          name: "index-changePassword",
          url: "../safety/index_changePassword_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开更换手机号码页面
      openChangePhone1(){
        _g.openWin({
          header: { title: "更换手机号码" },
          name: "index-changePhone1",
          url: "../safety/index_changePhone1_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      }
    },
    components: {
      vant,
    },
  });

  var _page = {};
  (function () {})();
  module.exports = {};
});

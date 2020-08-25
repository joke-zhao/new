define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("safety/index_changePhone3_view"),
    data: {
      count: 0,
      timer: null,
      codeDesc: "获取验证码",
      phone: "",
      sureNumber: "",
    },
    created: function () {},
    filters: {},
    methods: {
      // 请求验证码
      handleGetCode() {
        var ePhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (ePhone.test(this.phone)) {
          const TIME_COUNT = 60;

          if (!this.timer) {
            this.count = TIME_COUNT;
            this.getCode();
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                this.codeDesc = `${this.count}s后获取`;
              } else {
                clearInterval(this.timer);
                this.timer = null;
                this.codeDesc = "重新获取";
              }
            }, 1000);
          }
        } else {
          _g.toast("请输入正确手机号码");
        }
      },
      // 获取验证码
      getCode() {
        var url = "api/control/beatUser/sendSms?phoneNumber=" + this.phone;
        Http.ajax({
          url: url,
          data: {},
          method: "post",
          isSync: true,
          isJson: false,
          lock: false,
          success: function (ret) {
            if(ret.code === 200){
              _g.toast('验证码已发送');
            }else{
              _g.toast(ret.message)
            }
          },
        });
      },
      handlePhone() {
        var roleId = Number(_g.getLS("roleId"));
        var winName = "main-index-win";
        if (roleId === 2) {
          winName = "main-indexBoss-win"; // 0722-杨标泓改
        }
        if (!this.phone) {
          _g.toast("新手机号码不能为空");
        } else if (!this.sureNumber) {
          _g.toast("验证码不能为空");
        } else {
          var url = "api/control/beatUser/updateUserPhoneNumber";
          var option = {
            data: {
              sureNumber: this.sureNumber,
              phoneNumber: this.phone,
              userId: _g.getLS("userId"),
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
              _g.toast(ret.message);
              if (ret.code === 200) {
                _g.setLS('userPhone',main.phone)
                setTimeout(function () {
                  api.closeToWin({
                    name: winName,
                  });
                }, 1200);
              } else {
                _g.toast(ret.message);
              }
            },
          });
        }
      },
    },
  });

  var _page = {
    initSwiper: function () {
      var swiper = new Swiper(".swiper-container", {});
    },
  };
  (function () {})();
  module.exports = {};
});

define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('findPassword/index_view'),
        data: {
            count: 0,
            timer: null,
            codeDesc: "获取验证码",
            phone:'',
            sureNumber:'',
            password:'',
            newPassword:'',
        },
        created: function () {

        },
        filters: {

        },
        methods:{
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
          _g.alert("请输入正确手机号码");
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
      submitReg() {
        var ePhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
        var ePassWord = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/; //密码校验
        if (!ePhone.test(this.phone)) {
          _g.toast("手机号码错误");
        } else if (!this.sureNumber) {
          _g.toast("验证码不能为空");
        } else if (!ePassWord.test(this.password)) {
          _g.toast("密码强度为6~12位，必须包含数字和字母");
        }else if(this.password !== this.newPassword){
          _g.toast("两次密码不一致");
        } else {
          var self = this;
          var url = "api/control/beatUser/userForgetPassword";
          var option = {
            data: {
              phone: this.phone,
              passWord: this.password,
              sureNumber: this.sureNumber,
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
              if (ret.code === 200) {
                _g.toast(ret.data);
                // 修改密码成功跳回登录界面
                setTimeout(function () {
                  self.openLogin();
                }, 2000);
              } else {
                _g.toast(ret.message);
              }
            },
          });
        }
      },
      // 打开登录界面
      openLogin() {
        _g.openWin({
          name: "login-index",
          url: "../login/index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {},
        },"normal");
      },
        }
    });

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {});
        }
    };
    (function () {

    })();
    module.exports = {};
});

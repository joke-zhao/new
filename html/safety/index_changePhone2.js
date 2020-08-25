define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('safety/index_changePhone2_view'),
        data: {
          count: 0,
          timer: null,
          codeDesc: "获取验证码",
          phone:'',
          sureNumber:'',
        },
        created: function () {
          this.phone = _g.getLS('userPhone')
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
      handlePhone(){
        if(!this.sureNumber){
          _g.toast('验证码不能为空')
        }else{
          var url = "api/control/beatUser/updateUserPhoneNumber"
        var option = {
          data: {
            sureNumber: this.sureNumber,
            phoneNumber: this.phone,
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
            if(ret.code === 200){
              main.openChangePhone3()
            }else{
              _g.toast(ret.message)
            }
          },
        });
        }
        
      },
      // 打开验证手机号
      openChangePhone3() {
        _g.openWin({
          header: { title: "新的手机号码" },
          name: "index-changePhone3",
          url: "../safety/index_changePhone3_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
        });
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

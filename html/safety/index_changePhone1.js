define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('safety/index_changePhone1_view'),
        data: {
            phone:'',
        },
        created: function () {
          this.phone = _g.getLS('userPhone')
        },
        filters: {

        },
        methods:{
      // 打开验证手机号
      openChangePhone2() {
        _g.openWin({
          header: { title: "验证手机号码" },
          name: "index-changePhone2",
          url: "../safety/index_changePhone2_frame.html",
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

define(function (require, exports, module) {
  var Http = require('U/http');
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: '#main',
    template: _g.getTemplate('register/index_view'),
    data: {

    },
    created: function () {

    },
    components: {
      vant,
    },
    filters: {

    },
    methods: {
      onPicTap: function () {
        _g.execScript({
          winName: _g.getLS('rootWinName'),
          fnName: 'reloadApp'
        });
      },

      // 打开纳税人注册
      openTaxpayer() {
        _g.openWin({
          header: { title: '纳税人注册' },
          name: "register-taxpayer",
          url: "../register/register_taxpayer_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
            id: "1"
          } //携参
        })
      },
      // 打开服务商注册
      openService() {
        _g.openWin({
          header: { title: '服务商注册' },
          name: "register-service",
          url: "../register/register_service_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
            id: "3"
          } //携参
        })
      },
      // 打开游客注册
      openTourist() {
        this.$dialog.alert({
          title: '提示',
          message: '亲，为了更好地了解“拍账王”，请及时注册为纳税人或服务商！',
        }).then(() => {
          _g.setLS('nickName','一名可爱的游客')
          _g.setLS("roleName",'我是游客'); //存角色名称
          _g.setLS('companyList',JSON.stringify([])) //存公司列表
          _g.setLS("companyName", '拍账王体验号'); //存首位公司名
          _g.openWin(
              {
                  name: "main-indexBoss",
                  url: "../main/indexBoss_win.html",
                  bounces: false,
                  slidBackEnabled: false,
                  animation: { type: "none" },
              },
              "normal"
          );
        });
        // _g.openWin({
        //   header: { title: '游客注册' },
        //   name: "register-tourist",
        //   url: "../register/register_tourist_frame.html",
        //   bounces: false,
        //   slidBackEnabled: false,
        //   bgColor: '#fff',
        //   pageParam: {
        //     id: "5"
        //   } //携参
        // })
      },
    }
  });


  // _page.initSwiper();
  (function () {

  })();
  module.exports = {};
});

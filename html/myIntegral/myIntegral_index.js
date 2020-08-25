define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIntegral/myIntegral_index_view"),
    data: {
      integralList:[],
      integralTotal:0
    },
    created: function () {
      this.getIntegral()
      this.getIntegralList()
    },
    components: { vant },
    methods: {
      // 获取用户当前总积分
      getIntegral() {
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
            main.integralTotal = ret.data
          }
        })
      },
      // 获取用户积分列表
      getIntegralList() {
        var url = "api/control/beatPointsRecord/integralForApp";
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
          console.log(ret,'用户积分列表')
         if(ret.code === 200){
          main.integralList = ret.data
          if(main.integralList.length === 0){
            _g.toast('暂无积分数据')
          }
         }
        }
      })
    },
      // 打开积分规则页面
      openRule(){
        _g.openWin({
          header: { title: "积分规则" },
          name: "index-rule",
          url: "../myIntegral/index_rule_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      }
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
  (function () {})();
  module.exports = {};
});

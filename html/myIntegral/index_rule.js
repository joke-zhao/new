define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIntegral/index_rule_view"),
    data: {
      value:'',
      integralTotal:0
    },
    created: function () {
      this.getIntegral()
      this.getIntegralRule()
    },
    components: { vant },
    methods: {
      // 获取全部积分规则
      getIntegralRule() {
          var url = "api/control/beatRule/viewBeatRuleList";
        var option = {
          data: {}
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
            console.log(ret,'规则列表')
            if(ret.code == 200){
              ret.data.some(function(item){
                if(item.ruleName === '积分规则'){
                  return main.value = item.content
                }
              })
            }
          }
        })
      },
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
    },
    filters: {},
  });
  (function () {})();
  module.exports = {};
});

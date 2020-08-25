define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myPackage/index_rule_view"),
    data: {
      value:'',
      integralTotal:0
    },
    created: function () {
      this.getPackage()
    },
    components: { vant },
    methods: {
      // 获取全部积分规则
      getPackage() {
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
                if(item.ruleName === '佣金规则'){
                  return main.value = item.content
                }
              })
            }
          }
        })
      },
    },
    filters: {},
  });
  (function () {})();
  module.exports = {};
});

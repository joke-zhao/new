define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIncome/index_boss_view"),
    data: {
      bossList:[],
    },
    created: function () {
      this.getBossInfo()
    },
    methods: {
      // 获取我邀请的boss信息
      getBossInfo(){
        var url = "api/control/beatIncomeDetail/selectMyShareList";
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
            console.log(ret, "获取我邀请的boss信息");
            if(ret.code === 200){
             main.bossList = ret.data
            }else{
            _g.toast(ret.message)
            }
          },
        });
      },
    },
    filters: {
      formatDate(date) {
        if (!date) {
            return '暂无时间';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd")
          return a
        }
      },
  },
  });
  (function () {})();
  module.exports = {};
});

define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIncome/index_detail_view"),
    data: {
      isActive:1,
      tabs:[
        {id:1,name:'订单编号'},
        {id:2,name:'收入类型'},
        {id:3,name:'订单金额'},
        {id:4,name:'订单收入'},
      ],
      detailsList:[], //收入列表
    },
    created: function () {
      this.getDetailsInfo()
    },
    methods: {
      // 获取收入明细信息
      getDetailsInfo(){
        var url = "api/control/beatIncomeDetail/selectBeatIncomeDetailList";
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
            console.log(ret, "获取收入明细信息");
           
            if(ret.code === 200){
             main.detailsList = ret.data
            }else{
              _g.toast(ret.message)
            }
          },
        });
      },
    },
    filters: {},
  });
  (function () {})();
  module.exports = {};
});

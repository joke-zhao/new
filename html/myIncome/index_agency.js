define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myIncome/index_agency_view"),
    data: {
      isActive:false,
      sonList:[]
    },
    created: function () {
      this.getMySon()
    },
    methods: {
      // 点击查看用户下级代理
      handleUserSon(index,isActive){
        // 解决视图层不更新问题
        main.$set(this.sonList[index],'isActive',!isActive)
      },
      // 获取我的下级代理信息
      getMySon(){
        var url = "api/control/beatIncomeDetail/selectMyAgencyList";
        var option = {
          data: {
            phone: _g.getLS("userPhone"),
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
            console.log(ret, "获取我的下级代理信息");
            if(ret.code === 200){
             main.sonList = ret.data
            //  以下操作是为解决数据更新而视图层不更新问题
             main.sonList.map(function(i){
              main.$set(i,'isActive',false)
             })
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

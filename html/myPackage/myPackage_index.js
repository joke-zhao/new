define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myPackage/myPackage_index_view"),
    data: {
      packageList:[],
    },
    created: function () {
      this.getPackageList()
      window.UpdatePackageFn = function(){
        main.getPackageList()
      }
    },
    methods: {
      // 获取我的套餐列表
      getPackageList() {
        var url = "api/control/beatPackageOrder/list";
        var option = {
          data: {
            userId: _g.getLS("userId"),
          },
          limit:2,
          page:1
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
            console.log(ret)
            if(ret.code === 200){
              main.packageList = ret.data.records
              if(main.packageList.length === 0){
                _g.toast('暂无套餐订单')
              }
            }else{
              _g.toast(ret.message)
            }
          }
        })
      },
      // 打开全部套餐页面
      openAll(){
        _g.openWin({
          header: { title: "全部套餐" },
          name: "index_allPackage",
          url: "../myPackage/index_allPackage_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开套餐历史页面
      openHistory(){
        _g.openWin({
          header: { title: "套餐历史" },
          name: "index_history",
          url: "../myPackage/index_history_frame.html",
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
            return '';
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

define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myPackage/index_history_view"),
    data: {
      packageList:[],
      pageSize:10,
      pageNum:1,
      total:0,
      totalPages:0,
    },
    created: function () {
      this.getPackageList()
    },
    methods: {
      // 获取我的套餐列表
      getPackageList() {
        var url = "api/control/beatPackageOrder/list";
        var option = {
          data: {
            userId: _g.getLS("userId"),
          },
          limit:this.pageSize,
          page:this.pageNum
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
              main.total = ret.data.total
              main.totalPages = Math.ceil(ret.data.total / main.pageSize)
              main.packageList = main.packageList.concat( ret.data.records)
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
      }
    },
    filters: {
      formatDate(date) {
        if (!date) {
            return '日期异常';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd")
          return a
        }
      },
    },
  });
  // 下拉刷新
  _g.setPullDownRefresh(function () {
    main.pageNum = 1
    main.packageList = []
    main.getPackageList()
  });
  // 上拉加载更多
  _g.setLoadmore(10,function(){
    if(main.pageNum >= main.totalPages){
      _g.toast('数据已全部加载')
    }else{
      main.pageNum++
      main.getPackageList()
    }
  });
  (function () {})();
  module.exports = {};
});

define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("addTaxpayer/licenseList_view"),
    data: {
      checked:true,
      dataList:[], //单据审批列表
      pageSize:10,
      pageNumber:1,
    },
    created: function () { 
      this.dataList = api.pageParam.dataList;
      // _g.alert(this.dataList)
      window.UpdateListFn = function(data){
        main.delItem(data.index) //删除指定操作的列表项
      }
    },
    components: { vant },
    filters: {},
    methods: {
      // 删除子项
      delItem(index){
        this.dataList.splice(index, 1);
        // if(this.dataList.length === 0){
        //   api.closeWin();
        // }
      },
      // 打开单据审核详情
      openAddTaxpayer(item,index){
        _g.openWin({
          header: { title: '营业执照审核' },
          name: "addTaxpayer-auto",
          url: "../addTaxpayer/addTaxpayer_auto_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
              dataList: item,
              indexId:index,
              methods:"album",//album为相册，photo为相机
          } //携参
        });
      }
    },
    filters: {
    },
  });

  (function () {})();
  module.exports = {};
});

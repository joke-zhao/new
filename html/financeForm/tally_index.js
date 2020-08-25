define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("financeForm/tally_index_view"),
    data: {
      deptId:"",
      companyName:"",
      showShare: false,
      value1: 0,
      option1: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 },
      ],
      itemList: [],
      options: [
        { name: "图片", icon: "../../image/icon/image.png" },
        // { name: "表格", icon: "../../image/icon/biao.png" },
        // { name: "pdf", icon: "../../image/icon/pdf.png" },
      ],
      startDate:'', //开始时间
      endDate:'', //结束时间
      // acco:'201701记-1',
      // acct:'201801记-2',
      acco:'',
      acct:'',
      showDateStart:false, // 开始日期弹框
      showDateEnd:false, // 结束日期弹框
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2025, 10, 1),
      minEndData:null,
      currentDate: new Date(),
    },
    created: function () {
      this.companyName = _g.getLS('companyName')
      this.deptId = _g.getLS('deptId')
      this.openStartDate(new Date().getTime())
      this.openEndDate(new Date().getTime())
    },
    filters: {},
    methods: {
      handlSearch(){
        if(this.startDate == '' || this.endDate == ''){
          _g.toast('请选择查询起止时间')
        }else{
          this.getTally()
        }
      },
      // 获取记账凭证
      getTally(){
        var self = this
        var url = "api/control/erpdto/tallyProofDTO";
                    var option = {
                        data: {
                          deptId: this.deptId,
                          acco: this.acco,
                          acct: this.acct,
                          startDate: this.startDate,
                          endDate: this.endDate,
                        }
                    }
                    Http.ajax({
                        url: url,
                        data: option,
                        method: 'post',
                        isSync: true,
                        isJson: true,
                        lock: false,
                        success: function (ret) {
                          main.itemList = []
                          console.log(ret,'大家好')
                            if (ret.code === 200) {
                                if(ret.data.length === 0){
                                  _g.toast('暂无数据')
                                }else{
                                  _g.toast(ret.message)
                                  self.itemList = ret.data
                                }
                                
                            }
                        }
                    })
      },
      // 日期显示 - 不用动
      formatter(type, val) {
      if (type === 'year') {
        return val+'年';
      } else if (type === 'month') {
        return val+'月';
      } else if (type === 'day'){
        return val+'日'
      }
      return val;
    },
    // 操作开始时间
    handlStartDate(){
      this.showDateStart = true
    },
    openStartDate(val){
      var newDate = Date.parse(new Date(val));
      this.startDate = new Date(newDate).Format("yyyy-MM-dd")
      this.endDate = ""
      this.minEndData = new Date(newDate)
      this.showDateStart = false
    },
    closeStartDate(){
      this.showDateStart = false
    },
    // 操作结束时间
    handlEndDate(){
      if(this.startDate){
        this.showDateEnd = true
      }else{
        _g.toast('请先选择开始时间')
      }
      
    },
    openEndDate(val){
      var newDate = Date.parse(new Date(val));
      this.endDate = new Date(newDate).Format("yyyy-MM-dd")
      this.showDateEnd = false
    },
    closeEndDate(){
      this.showDateEnd = false
    },
     // 选择导出方式
    onSelect(option) {
      // vant.toast(option.name);
      if (option.name == "图片") {
        this.getImg();
        this.showShare = false;
      }
      if (option.name == "表格") {
        this.exportExcel();
        this.showShare = false;
      }
    },
    // app生成图片
    getImg() {
      htmltoImage.init(
        {
          el: document.getElementById("main"),
          isImageObject: true,
        },
        function (res, err) {
          if (res) {
            var base64Str1 = htmltoImage.cutprefixBase64(res.base64str);
            var trans = api.require("trans");
            trans.saveImage(
              {
                base64Str: base64Str1,
                album: true,
                imgName: new Date().getTime() + ".png",
              },
              function (ret, err) {
                if (ret.status) {
                  _g.toast(JSON.stringify(ret));
                } else {
                  _g.toast(JSON.stringify(err));
                }
              }
            );
          } else {
            _g.toast(JSON.stringify(err));
          }
        }
      );
    },
    // 导出Excel
    exportExcel() {
      var url = "api/control/exportErp/exportExcel";
      var option = {
        data: {
          createHeader: true,
          tableName: "记账凭证表",
          title: _g.getLS("companyName") + "~记账凭证表",
          list: main.itemList,
          sheetName: "表格1",
          fileName: "excelForm",
        },
      };
      Http.ajax({
        url: url,
        data: option,
        method: "post",
        isSync: false,
        isJson: true,
        lock: false,
        success: function (ret) {
          if (ret.code === 200) {
            _g.toast(ret.message);
            window.location.href = ret.data;
          }
        },
      });
    },
    },
    components: {
      vant,
    },
  });

  var _page = {
    initSwiper: function () {
      var swiper = new Swiper(".swiper-container", {});
    },
  };
  (function () {})();
  module.exports = {};
});

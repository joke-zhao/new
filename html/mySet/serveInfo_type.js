define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/serveInfo_type_view"),
    data: {
      serveTagList:[], // 标签列表
      selectTagList:[], // 选中的服务标签
      compId:"" // 用户公司列表首位Id
    },
    created: function () {
      this.getServeTag()
      this.getCompanyList()
    },
    methods: {
      // 点击选中标签
      handleTag(index,status){
        if(status === 2){
          this.serveTagList[index].status = 1
        }else{
          this.serveTagList[index].status = 2
        }
        this.changeTag()
      },
      // 修改选中的服务标签
      changeTag(){
        if(this.selectTagList.length >= 3){
          _g.toast('最多可选择3项服务类型')
        }else{
          this.selectTagList = []
          this.serveTagList.forEach(function(i){
            if(i.status === 1){
              main.selectTagList.push(i.id)
            }
          })
        }
        console.log(this.selectTagList,'服务标签列表')
      },
      // 返回上一页 将选中的服务标签赋值
      upDataServeTag(){
        _g.execScript({
          winName: "index-serveInfo-win",
          frameName: "index-serveInfo-frame",
          fnName: "UpdateServerTypeFn",
          data:{
            selectTagList:main.selectTagList
          }
        });
        api.closeWin()
      //   if(this.selectTagList.length === 0){
      //     _g.toast('请选择服务标签')
      //   }else{
      //     var url = 'api/control/beatUser/updateServerType'
      //     var option = {
      //     data : {
      //       companyId:this.compId,
      //       serverTypes:this.selectTagList.toString()
      //     }
      //   }
      //   Http.ajax({
      //     url: url,
      //     data: option,
      //     method: "post",
      //     isSync: false,
      //     isJson: true,
      //     lock: false,
      //     success: function (ret) {
      //         _g.toast(ret.message)
      //         if (ret.code == 200) {
      //           setTimeout(function () {
      //             api.closeWin();
      //           }, 800);
      //         }
      //     },
      // });
      //   }
      },
      // 获取该服务商首位公司
      getCompanyList() {
        var self = this;
        var url = "api/control/beatCompany/handleCompany";
        var options = {
          data: {
            userId: _g.getLS('userId'),
          },
        };
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "/???");
            if (ret.code === 200) {
              main.compId = ret.data[0].id
            }
          },
        });
      },
      // 获取服务标签
      getServeTag(){
        var url = 'api/control/beatLabel/selectBeatLabelList'
        Http.ajax({
          url: url,
          data: {},
          method: "post",
          isSync: false,
          isJson: true,
          lock: false,
          success: function (ret) {
              if (ret.code == 200) {
                console.log(ret)
                main.serveTagList = ret.data.list
              }
          },
      });
      },
    }
  });

  (function () {})();
  module.exports = {};
});

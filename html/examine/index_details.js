define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("examine/index_details_view"),
    data: {
      eID: "",
      billType: "",
      billData: {}, //审核对象
      printShow: true,
      userSign:'', //审批人签名
    },
    created: function () {
      this.eID = api.pageParam.eID;
      this.billData.imgUrl = api.pageParam.imgUrl
      this.billType = api.pageParam.type;
      this.getExamineDetails(this.eID);
    },
    components: { vant },
    methods: {
      // 获取单据审批单个详情
      getExamineDetails(eId) {
        var self = this;
        var url = "api/control/beatReceipt/view";
        var option = {
          data: {
            id: eId,
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
            console.log(ret, "获取到的数据");
            if(ret.code === 200){
              self.userSign = ret.data.userSign
              self.billData = ret.data[self.billType.toLowerCase()];
              // self.billData = ret.data.invoice;
            }
          },
        });
      },
      // 单据审批提交
      sumbit(statusID) {
        console.log(statusID, "审批状态");
        var self = this;
        this.billData.openDate = new Date(self.billData.openDate).Format(
          "yyyy-MM-dd"
        );
        console.log(self.billData.openDate);
        var url = "api/control/beatReceipt/approval";
        var option = {
          data: {
            [self.billType.toLowerCase()]: self.billData,
            userId: _g.getLS("userId"),
            receiptId: self.eID,
            type: self.billType,
            status: statusID, // 1-审批完成:SuccessApproval 2-审批驳回:FailureApproval
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
            console.log(ret, "获取到的数据");
            if (ret.code == 200) {
              _g.toast(ret.message);
              setTimeout(function () {
                api.closeWin();
                _g.execScript({
                  winName: "main-indexBoss-win",
                  frameName: "examine-index-frame",
                  fnName: "UpdateExaFn",
                });
              }, 800);
            }else{
              _g.toast(ret.message)
            }
          },
        });
      },
      // 点击查看图片
      handleImgUrl() {
        if (main.billData.imgUrl) {
          _g.photoBrowser({ picList: [main.billData.imgUrl] });
        } else {
          _g.toast("暂无图片查看");
        }
      },
      // 打印
      print() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (
          bIsIpad ||
          bIsIphoneOs ||
          bIsMidp ||
          bIsUc7 ||
          bIsUc ||
          bIsAndroid ||
          bIsCE ||
          bIsWM
        ) {
          console.log('移动设备')
          this.exportImg()
        } else {
          console.log('web')
          window.print()
        }
        
      },
      // 导出图片
      exportImg(){
        htmltoImage.init(
          {
            el: document.getElementById("main"),
            isImageObject: true,
          },
          function (res, err) {
            if (res) {
              // alert(JSON.stringify(res));
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
                    // alert(JSON.stringify(ret));
                    _g.toast("导出图片成功~")
                  } else {
                    // alert(JSON.stringify(err));
                  }
                }
              );
            } else {
              // alert(JSON.stringify(err));
            }
          }
        );
      }
    },
    filters: {
      formatDate(date) {
        if (!date) {
          return "请选择时间";
        } else {
          var a = new Date(date).Format("yyyy-MM-dd");
          return a;
        }
      },
    },
  });

  (function () {})();
  module.exports = {};
});

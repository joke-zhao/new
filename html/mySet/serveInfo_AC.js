define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/serveInfo_AC_view"),
    data: {
      AcUrl:'', //纸质认证图片
    },
    created: function () {
      this.AcUrl = api.pageParam.AcUrl
    },
    methods: {
      // 选择图片上传
      submitImg() {
        var UIAlbumBrowser = api.require('UIAlbumBrowser');
                UIAlbumBrowser.open({
                  max:1,
                    styles: {
                        bg: '#fff',//（可选项）字符串类型；资源选择器背景，支持 rgb，rgba，#；默认：'#FFFFFF'
                        mark: {//（可选项）JSON对象；选中图标的样式
                            icon: '', //（可选项）字符串类型；图标路径（本地路径，支持fs://、widget://）；默认：对勾图标
                            position: 'top_right',//（可选项）字符串类型；图标的位置，默认：'bottom_left'
                            // 取值范围：
                            // top_left（左上角）
                            // bottom_left（左下角）
                            // top_right（右上角）
                            // bottom_right（右下角）
                            size: 20//（可选项）数字类型；图标的大小；默认：显示的缩略图的宽度的三分之一
                        },
                        texts: {
                            stateText: '已选择*项',
                            cancelText: '取消',
                            finishText: '完成'
                        },
                        nav: {                              //（可选项）JSON对象；导航栏样式
                            bg: 'rgba(0,0,0,1)',                     //（可选项）字符串类型；导航栏背景，支持 rgb，rgba，#；默认：'#eee'
                            stateColor: '#fff',             //（可选项）字符串类型；状态文字颜色，支持 rgb，rgba，#；默认：'#000'
                            stateSize: 18,                  //（可选项）数字类型；状态文字大小，默认：18
                            cancelBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；取消按钮背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            cancelColor: '#fff',            //（可选项）字符串类型；取消按钮的文字颜色；支持 rgb，rgba，#；默认：'#000'
                            cancelSize: 16,                 //（可选项）数字类型；取消按钮的文字大小；默认：18
                            finishBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；完成按钮的背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            finishColor: '#fff',            //（可选项）字符串类型；完成按钮的文字颜色，支持 rgb，rgba，#；默认：'#000'
                            finishSize: 16                  //（可选项）数字类型；完成按钮的文字大小；默认：18
                        }
                    },
                    rotation: true
                }, function (ret) {
                    if (ret.eventType === "cancel") {
                        _g.toast("您取消了上传哦~")
                    }
                    if (ret.eventType === "confirm") {
                        var url = "upload/storageObj?type=1";
                        var filePaths = ret.list[0].path;
                        Http.ajax({
                            data: { file: filePaths },
                            isFile: true,
                            isJson: false,
                            method: "post",
                            isSync: true,
                            lock: false,
                            url: url,
                            success: function (ret) {
                                if (ret.code == 200) {
                                 main.AcUrl = ret.data.realPath
                                }else{
                                  _g.toast(ret.message)
                                }
                            }
                        })
                    }
                });
      },
      // 更新资质认证
      upDataAC(){
        _g.execScript({
          winName: "index-serveInfo-win",
          frameName: "index-serveInfo-frame",
          fnName: "UpdateAcUrlFn",
          data:{
            AcUrl:main.AcUrl
          }
        });
        api.closeWin()
      },
    }
  });

  (function () {})();
  module.exports = {};
});

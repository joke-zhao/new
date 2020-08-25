define(function (require, exports, module) {
  var Http = require("U/http");
  var imageClip = require('U/ImageClip');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("pat/pat_index_view"),
    data: {
      dialogShow: true,
      aaa: ""
    },
    created: function () { },
    filters: {},
    methods: {
      //! 拍照上传 新增纳税人
      openCamera() {
        imageClip.openPicActionSheet()
        //     api.getPicture({
        //       sourceType: 'camera',
        //       encodingType: 'jpg',
        //       mediaValue: 'pic',
        //       destinationType: 'url',
        //       allowEdit: true,
        //       quality: 100,
        //       //TODO width和height 可以设置图片的大小   不传为原图
        //       targetWidth: 2160,
        //       targetHeight: 2160,
        //       saveToPhotoAlbum: true,
        //       groupName:"拍账王"
        //     }, function (ret, err) {
        //       if (ret) {
        //         if (!ret.data) {
        //           _g.toast("取消了打开相机~")
        //         } else {
        //           var filePath = [ret.data];
        //         //   // _g.alert(filePath.data)
        //           var url = "api/control/beatReceipt/batchUpload";
        //           // alert(filePath.length)
        //           var pathList = [];
        //           var timeList = [];
        //           for (let i = 0; i < filePath.length; i++) {
        //             pathList.push(filePath[i])
        //             timeList.push(new Date().Format("yyyy-MM-dd hh:mm:ss:S"))
        //           }
        //
        //       // alert(timeList)
        //       // alert(files)
        //       Http.ajax({
        //         data: { files: pathList },
        //         isFile: true,
        //         isJson: false,
        //         method: "post",
        //         time: timeList,
        //         isSync: true,
        //         lock: false,
        //         url: url,
        //         success: function (ret) {
        //           if (ret.code == 200) {
        //             _g.toast(ret.message)
        //             // var dataList = ret.data;
        //             // _g.alert(dataList)
        //             // _g.openWin({
        //             //   header: { title: '拍照识别' },
        //             //   name: "addTaxpayer-auto",
        //             //   url: "../addTaxpayer/addTaxpayer_auto_frame.html",
        //             //   bounces: false,
        //             //   slidBackEnabled: false,
        //             //   bgColor: '#fff',
        //             //   pageParam: {
        //             //     dataList: dataList,
        //             //   } //携参
        //             // })
        //           }
        //         }
        //       })
        //     }
        //   } else {
        //     // alert(JSON.stringify(err));
        //     _g.alert("取消了拍照~");
        //   }
        // });
      },
      //! 相册上传 新增纳税人
      openAlbum() {
        var UIAlbumBrowser = api.require('UIAlbumBrowser');
        UIAlbumBrowser.open({
          max: 9999,
          styles: {
            bg: '#fff', //（可选项）字符串类型；资源选择器背景，支持 rgb，rgba，#；默认：'#FFFFFF'
            mark: { //（可选项）JSON对象；选中图标的样式
              icon: '', //（可选项）字符串类型；图标路径（本地路径，支持fs://、widget://）；默认：对勾图标
              position: 'top_right', //（可选项）字符串类型；图标的位置，默认：'bottom_left'
              // 取值范围：
              // top_left（左上角）
              // bottom_left（左下角）
              // top_right（右上角）
              // bottom_right（右下角）
              size: 20 //（可选项）数字类型；图标的大小；默认：显示的缩略图的宽度的三分之一
            },
            texts: {
              stateText: '已选择*项',
              cancelText: '取消',
              finishText: '完成'
            },
            nav: { //（可选项）JSON对象；导航栏样式
              bg: 'rgba(0,0,0,1)', //（可选项）字符串类型；导航栏背景，支持 rgb，rgba，#；默认：'#eee'
              stateColor: '#fff', //（可选项）字符串类型；状态文字颜色，支持 rgb，rgba，#；默认：'#000'
              stateSize: 18, //（可选项）数字类型；状态文字大小，默认：18
              cancelBg: 'rgba(0,0,0,0)', //（可选项）字符串类型；取消按钮背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
              cancelColor: '#fff', //（可选项）字符串类型；取消按钮的文字颜色；支持 rgb，rgba，#；默认：'#000'
              cancelSize: 16, //（可选项）数字类型；取消按钮的文字大小；默认：18
              finishBg: 'rgba(0,0,0,0)', //（可选项）字符串类型；完成按钮的背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
              finishColor: '#fff', //（可选项）字符串类型；完成按钮的文字颜色，支持 rgb，rgba，#；默认：'#000'
              finishSize: 16 //（可选项）数字类型；完成按钮的文字大小；默认：18
            }
          },
          rotation: true
        }, function (ret) {
          if (ret.eventType === "cancel") {
            _g.toast("您取消了上传哦~")
          }
          if (ret.eventType === "confirm") {
            // alert(JSON.stringify(ret.list));
            var url = "api/control/beatReceipt/batchUpload";
            var filePaths = ret.list;
            // alert(files.length)
            var pathList = [];
            var timeList = [];
            for (let i = 0; i < filePaths.length; i++) {
              pathList.push(filePaths[i].path)
              timeList.push(new Date().Format("yyyy-MM-dd hh:mm:ss:S"))
            }
            // alert(files)
            Http.ajax({
              data: {files: pathList},
              isFile: true,
              isJson: false,
              method: "post",
              time: timeList,
              isSync: true,
              lock: false,
              url: url,
              success: function (ret) {
                if (ret.code == 200) {
                  var dataList = ret.data;
                  // _g.alert(dataList)
                  // _g.openWin({
                  //   header: { title: '拍照识别' },
                  //   name: "addTaxpayer-auto",
                  //   url: "../addTaxpayer/addTaxpayer_auto_frame.html",
                  //   bounces: false,
                  //   slidBackEnabled: false,
                  //   bgColor: '#fff',
                  //   pageParam: {
                  //     dataList: dataList,
                  //   } //携参
                  // })
                }
              }
            })
          }
        });
      },
    },
  });

  (function () {
    window.clipFinish = function (Path) {
      Path = api.fsDir + Path.replace('fs:/', '')
      // main.aaa = api.fsDir + Path.replace('fs:/', '')
      // Path = main.aaa
      var filePath = [Path];
      var url = "api/control/beatReceipt/batchUpload";
      var pathList = [];
      var timeList = [];
      for (let i = 0; i < filePath.length; i++) {
        pathList.push(filePath[i])
        timeList.push(new Date().Format("yyyy-MM-dd hh:mm:ss:S"))
      }
      Http.ajax({
        data: {
          files: pathList
        },
        isFile: true,
        isJson: false,
        method: "post",
        time: timeList,
        isSync: true,
        lock: false,
        url: url,
        success: function (ret) {
          if (ret.code == 200) {
            _g.toast(ret.message)
          }
        }
      })
    }
  })(); 
  module.exports = {};
});

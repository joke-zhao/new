define(function (require, exports, module) {
  var Http = require("U/http");
  var drawingBoard = api.require("drawingBoard");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/signature_view"),
    data: {},
    created: function () {
      this.qianming();
    },
    filters: {},
    methods: {
      onPicTap: function () {
        _g.execScript({
          winName: _g.getLS("rootWinName"),
          fnName: "reloadApp",
        });
      },
      save() {
        drawingBoard.save(
          {
            savePath: "fs://paizhangwang/qianming/result.png",
            copyToAlbum: true,
            // overlay: true,
          },
          function (ret) {
            // alert(JSON.stringify(ret));
            var url = "upload/storageObj?type=1";
            var option = {
              file: "fs://paizhangwang/qianming/result.png",
            };
            Http.ajax({
              url: url,
              data: option,
              method: "post",
              isFile: true,
              isSync: false,
              isJson: true,
              lock: false,
              success: function (ret) {
                //TODO  回调上传签名
                var userSign = ret.data.realPath;
                var url = "api/control/beatUser/" + _g.getLS("userId");
                var option = {
                  sign: ret.data.realPath,
                };
                Http.ajax({
                  url: url,
                  data: option,
                  method: "put",
                  isSync: false,
                  isJson: true,
                  lock: false,
                  success: function (ret) {
                    if (ret.code === 200) {
                      if (ret.data) {
                        _g.setLS("userSign",userSign);
                        _g.toast("上传签名成功~");
                        setTimeout(function(){
                            api.closeWin();
                        _g.execScript({
                          winName: "index-userInfo-win",
                          frameName: "index-userInfo-frame",
                          fnName: "UpdateSignFn",
                        });
                        },800)
                        
                      } else {
                        _g.toast(ret.message);
                      }
                    }
                  },
                });
              },
            });
          }
        );
      },
      revoke() {
        drawingBoard.revoke();
      },
      restore() {
        drawingBoard.restore();
      },
      clear() {
        drawingBoard.clear();
      },
      qianming() {
        drawingBoard.open({
          rect: {
            x: 0,
            y: 0,
            // w: 320,
            h: 400,
          },
          styles: {
            brush: {
              // color: '#ff0',
              color: "#000",
              width: 2,
            },
            bgColor: "#ccc",
          },
          fixedOn: api.frameName,
        });
      },
    },
  });

  (function () {})();
  module.exports = {};
});

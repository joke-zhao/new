define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("uploader/uploader_view"),
    data: {
      fileList: [],
    },
    components: {
      vant,
    },
    created: function () {
    },
    filters: {},
    methods: {
      afterRead(file) {

        // _g.alert(file);
        //   file.status = 'uploading';
        //   file.message = '上传中...';

        //   setTimeout(() => {
        //     file.status = 'failed';
        //     file.message = '上传失败';
        //   }, 1000);
      },
      onOversize(file) {
        // _g.alert(this.fileList);
      },
    },
  });

  (function () { })();
  module.exports = {};
});

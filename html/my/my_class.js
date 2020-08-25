define(function (require, exports, module) {
  var Http = require("U/http");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("my/my_class_view"),
    data: {
      classList: []
    },
    created: function () {
      this.selectMyCourse()
    },
    filters: {},
    methods: {
      selectMyCourse() {
        var url = 'api/control/beatCourse/selectMyCourse'
        var postData = {
          data: {
            userId: _g.getLS('userId')
          }
        }
        Http.ajax({
          data: postData,
          isJson: true,
          method: "post",
          isSync: false,
          lock: false,
          url: url,
          success: function (ret) {
            if (ret.code === 200) {
              main.classList = ret.data;
            }
          },
        })
      },

      //打开课程详情
      openClassDetails(id) {
        _g.openWin({
          header: {
            title: '课程详情'
          },
          name: "class-details",
          url: "../eTaxClass/class_details_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
            classId: id
          } //携参
        })
      },
    },
  });

  (function () { })();
  module.exports = {};
});

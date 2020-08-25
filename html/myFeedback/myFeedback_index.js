define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myFeedback/myFeedback_index_view"),
    data: {
      value:''
    },
    created: function () {},
    components: { vant },
    methods: {
      // 提交意见反馈
      submit() {
        if(!this.value){
          _g.toast('请填写反馈内容')
        }else{
          var url = "api/control/beatFeedback/insertFeedback";
        var option = {
          data: {
            content:this.value,
            userId: _g.getLS("userId"),
          }
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
            if(ret.code === 200){
              _g.toast('反馈成功')
              setTimeout(function(){
                api.closeWin()
              },1200)
            }else{
              _g.toast(ret.message)
            }
          }
        })
        }
      }
    },
    computed: {
      strLength() {
        return this.value.length
      }
    },
    filters: {},
  });
  (function () {})();
  module.exports = {};
});

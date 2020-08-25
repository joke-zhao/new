define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('eTaxClass/report_question_view'),
        data: {
            titles:'',//标题输入框内容
            content:'',//文本域内容
        },
        computed:{
            titlecount:function () {
                return this.titles.length;
            },
            contentcount:function () {
                return this.content.length;
            }
        },
        created: function () {

        },
        filters: {

        },
        methods:{
          //发布问题
          createProblem() {
            var url = "api/control/beatProblem/createBeatProblem";
            var option = {
                data:{
                    content: this.content,
                    creatTime: new Date(),
                    photo: _g.getLS("photoUrl"),
                    sum: 0,
                    title: this.titles,
                    userId: _g.getLS("userId"),
                    userName: _g.getLS("nickName"),
                }
            }
            Http.ajax({
                url: url,
                data: option,
                method: 'post',
                isSync: true,
                isJson: true,
                lock: true,
                success: function(ret) {
                    if (ret.code === 200) {
                        _g.toast("发布成功~");
                        setTimeout(function () {
                            api.closeWin();
                        }, 2000);
                    }
                }
            })
        },
        }
    });

    var _page = {
    };

    (function () {

    })();
    module.exports = {};
});

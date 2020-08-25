define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('mySet/aboutUs_view'),
        data: {
            content:'记账就用拍账王，一拍，二传，三成账',
            contentList:[],
        },
        created: function () {
            var self = this;
            var url = "api/control/beatAboutUs/getBeatAboutUs";
            var options = {
                data: {
                }
            };
            Http.ajax({
                data: options,
                isFile: false,
                isJson: true,
                method: "post",
                isSync: false,
                lock: false,
                url: url,
                success: function (ret) {
                    if (ret.code === 200) {
                        main.content = ret.data[0].content;
                    } else {
                        _g.toast(ret.message);
                    }
                },
            });

        },
        filters: {

        },
        methods:{
        //  获取关于我们介绍

        }
    });




    (function () {

    })();
    module.exports = {};
});

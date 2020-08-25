define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('cooperation/freelancerSettlement_view'),
        data: {
        },
        created: function () {

        },
        filters: {

        },
        methods:{
        //    进入我要入驻
            openJoin(){
                _g.openWin({
                    header:{title:'资质认证'},
                    name:"auth-index",
                    url:"../cooperation/index_auth_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            }
        }
    });




    (function () {

    })();
    module.exports = {};
});

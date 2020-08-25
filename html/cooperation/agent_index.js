define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('cooperation/agent_view'),
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
                    header:{title:'申请代理'},
                    name:"applicationAgency-index",
                    url:"../cooperation/applicationAgency_index_frame.html",
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

define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('cooperation/cooperation_view'),
        data: {
            roleId:0
        },
        created: function () {
            this.roleId = Number(_g.getLS('roleId'))
        },
        filters: {},
        methods: {
            //打开自由职业者
            openFreelancer() {
                _g.openWin({
                    header:{title:'我要成为自由职业者'},
                    name:"freelancerSettlement-index",
                    url:"../cooperation/freelancerSettlement_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            },
        //    打开服务商
            openService(){
                _g.openWin({
                    header:{title:'我要成为服务商'},
                    name:"serviceProvider-index",
                    url:"../cooperation/serviceProvider_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            },
        //    打开代理商
            openAgent(){
                _g.openWin({
                    header:{title:'我要成为代理商'},
                    name:"agent-index",
                    url:"../cooperation/agent_index_frame.html",
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

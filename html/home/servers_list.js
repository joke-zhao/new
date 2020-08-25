define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/servers_list_view'),
        data: {
            serverList: [],
        },
        created: function () {
            this.selectServerList();
        },
        filters: {
            //保留2位小数点过滤器 不四舍五入
            number(value) {
                var toFixedNum = Number(value).toFixed(3);
                var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
                return realVal;
            }
        },
        methods: {
            openRegisterBuy(index) {
                console.log(this.serverList[index].id)
                _g.openWin({
                    header: { title: '注册代办' },
                    name: "register-buy",
                    url: "../home/register_buy_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        id: this.serverList[index].id
                    } //携参
                })
            },
            // 获取当前位置并查询服务商列表
            selectServerList() {
                var url = "api/control/beatServer/selectServerByUserLoLa"
                var option = {
                    data: {
                        latitude: 23.11,
                        // latitude: api.pageParam.lat,
                        longitude: 113.48,
                        // longitude: api.pageParam.lon
                    },
                };
                Http.ajax({
                    data: option,
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        console.log(ret.data)
                        main.serverList = ret.data
                    }
                })
            },
        }
    });

    (function () {

    })();
    module.exports = {};
});

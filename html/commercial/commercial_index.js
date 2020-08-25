define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('commercial/commercial_index_view'),
        data: {
            dialogShow:false,
            roleId: -1
        },
        created() {
            this.roleId = Number(_g.getLS('roleId'))
            this.getLocation()
        },
        filters: {

        },
        methods:{
            getLocation() {
                var self = this;
                var bMap = api.require('bMap');
                bMap.getLocation({
                    accuracy: '100m',
                    autoStop: true,
                    filter: 1
                }, function (ret, err) {
                    if (ret.status == false) {
                        _g.toast("请检查手机位置权限是否开启~")
                    } else if (ret.status == true) {
                        main.lon = ret.lon;
                        main.lat = ret.lat;
                        // alert(JSON.stringify(ret));
                        var lon = ret.lon;
                        var lat = ret.lat;
                        self.openbMap(lon, lat);
                        self.selectServer(lon, lat);
                    } else {
                        _g.toast("位置获取失败！")
                    }
                });
            },
            //打开公司注册界面
           openCompanyReg(){
               let roleId = Number(_g.getLS('roleId'))
               if (roleId === 1 || roleId === 2){
                   // 打开服务商列表页面
                   _g.openWin({
                       header: {
                           title: '服务商列表'
                       },
                       name: "server-list",
                       url: "../home/servers_list_frame.html",
                       bounces: false,
                       slidBackEnabled: false,
                       bgColor: '#fff',
                       pageParam: {
                           lon: main.lon,
                           lat: main.lat
                       } //携参
                   })
               }else if (roleId === 3 || roleId === 4){
                   _g.openWin({
                       header:{title:'公司注册'},
                       name:"index-companyReg",
                       url:"../commercial/index_companyReg_frame.html",
                       bounces:false,
                       slidBackEnabled:false,
                       bgColor:'#fff',
                       pageParam:{} //携参
                   })
               }
            }
        }
    });

    (function () {

    })();
    module.exports = {};
});

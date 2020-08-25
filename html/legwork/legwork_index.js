define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('legwork/legwork_index_view'),
        data: {
            isConcat:false,
            list:[],
            currentPage:1,
            totalPage:1,
            lon:0,
            lat:0,
            userId:''
        },
        filters: {
            formatDate(date) {
                var date = new Date(date);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())+'日';
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return MM + DD+' '+hh+mm;
            },
            pointSub(value){
                var trim = value.toString().trim();
                var pointIndex = trim.indexOf(".");
                return trim.slice(0,pointIndex+2)
            },
            //地址过长时截断
            subText(val){
              var str = val;
              if(str.length>13){
                return str.substring(0,13)+'...';
              }
              return val;
            }
        },
        created:function(){
            this.userId = _g.getLS('userId');
            var self = this;
            window.closeAndRefresh = function () {
                self.close();
            };
            this.getLocation();
        },
        methods: {
          //刷新数据并关闭接单页面
          close(){
            console.log(11111111111);
            api.closeWin({
              name:'index-receipt-win'
            });
            this.isConcat = false;
            this.getList();
          },
            getList(){
                Http.ajax({
                    data: {
                        data:{
                            currentLatitude: main.lat,
                            currentLongitude: main.lon,
                            "helpOther": true,
                            "pageNum": main.currentPage,
                            "pageSize": 10,
                            "receiveAccept": false,
                            "receiveAll": false,
                            "receiveEnd": false,
                            "receiveSend": false,
                            "receiveUserId": false,
                            "sendAccept": false,
                            "sendAll": false,
                            "sendEnd": false,
                            "sendPay": false,
                            "userId": main.userId
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: 'api/control/beatRunErrand/list',
                    success: (res) =>{
                        console.log(res);
                        if(this.isConcat)
                          main.list = main.list.concat(res.data.records);
                        else{
                          main.list = res.data.records;
                        }
                        main.currentPage = res.data.current;
                        main.totalPage = res.data.pages;
                    }
                })
            },
            //打开定位
            getLocation() {
                var self = this;
                var bMap = api.require('bMap');
                console.log(bMap);
                bMap.getLocation({
                    accuracy: '100m',
                    autoStop: true,
                    filter: 1
                }, function(ret, err) {
                    if (ret.status == false) {
                        _g.toast("请检查手机位置权限是否开启~")
                        main.address = '定位失败'
                    } else if (ret.status == true) {
                        // alert(JSON.stringify(ret));
                        var lon = ret.lon;
                        var lat = ret.lat;
                        console.log(lon);
                        console.log(lat);
                        main.lon = ret.lon;
                        main.lat = ret.lat;
                        main.getList();
                    } else {
                        main.address = '定位失败'
                        _g.toast("位置获取失败！")
                    }
                });
            },

            // 打开接单页
            openReceipt(item){
                console.log(item);
                var id = item.id;
                _g.openWin({
                    header:{title:'接单'},
                    name:"index-receipt",
                    url:"../legwork/index_receipt_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{id} //携参
                });

            },

            // 打开找人跑页面
            openLookfor(){
                _g.openWin({
                    header:{title:'找人跑'},
                    name:"legwork-lookfor",
                    url:"../legwork/legwork_lookfor_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            },
            // 打开我的订单页面
            openOrder(){
                _g.openWin({
                    header:{title:'我的订单'},
                    name:"legwork-order",
                    url:"../legwork/legwork_order_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            }
        }
    });
    _g.setLoadmore(10,function(){
        if(main.currentPage >= main.totalPage){
            _g.toast('数据已全部加载')
        }else{
            main.currentPage++;
            main.isConcat = true;
            main.getList();
        }

    });
    _g.setPullDownRefresh(function () {
        main.currentPage = 1;
        main.isConcat = false;
        main.list = [];
        main.getList();
    });
    var _page = {

    };
    //_page.initSwiper();

    (function () {

    })();
    module.exports = {};
});

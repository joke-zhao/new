define(function(require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var vant = require('L/vant/vant.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('bMap/index_view'),
        data: {
            addressName: "",
            LenovoWord: []
        },
        components: {
            vant,
        },
        created: function() {
            this.getLocation();
        },
        filters: {},
        methods: {
            // onSearch() {
            //     var signature = "180cdd58cfac57d9082c5d775ee852e6";
            //     var timestamp = "1593970108846";
            //     var content = "NRyv2t6EenD4lCbwFU2UxWpI8Pb+A9R4y6xkkMI6ojC37QLopki9JCHXwVJ8aPhOS04M3S0r+BnIMC7MvYymvBEPgBSxX+m7KFKydScBLa9sjBWhrhismbcyK0ConlhjXWjuMYQTde5DohK7Rcgv/RiKaV6LFZYqgzSlbGVwBSRKZ0azjmn7Da6H8sgAgAls5PX4KQdklomStztMKJZoKy4xTkAU/6sdROT1nK2Z5FkIYA234I8u+sW1mv+F6yyyprhblYVU3PLCBwu8tLpVmqU/OwZWQ0yJVOwz+CCT0DA=";

            //     var url = "intern/CerContractCallBack/contractCallBack";//?signature=" + signature + "&timestamp=" + timestamp + "&" + "content=" + content
            //     var option = {
            //         data: {
            //             signature: "180cdd58cfac57d9082c5d775ee852e6",
            //             timestamp: "1593970108846",
            //             content: "NRyv2t6EenD4lCbwFU2UxWpI8Pb+A9R4y6xkkMI6ojC37QLopki9JCHXwVJ8aPhOS04M3S0r+BnIMC7MvYymvBEPgBSxX+m7KFKydScBLa9sjBWhrhismbcyK0ConlhjXWjuMYQTde5DohK7Rcgv/RiKaV6LFZYqgzSlbGVwBSRKZ0azjmn7Da6H8sgAgAls5PX4KQdklomStztMKJZoKy4xTkAU/6sdROT1nK2Z5FkIYA234I8u+sW1mv+F6yyyprhblYVU3PLCBwu8tLpVmqU/OwZWQ0yJVOwz+CCT0DA=",
            //         }
            //     }
            //     Http.ajax({
            //         data: option,
            //         isFile: false,
            //         isJson: true,
            //         method: "post",
            //         isSync: true,
            //         lock: false,
            //         url: url,
            //         success: function (ret) {
            //         }
            //     })
            // },
            getMessage(item) {
                // _g.alert(item)
                // _g.openWin({
                //     header: { title: '服务商注册' },
                //     name: "register-service-win",
                //     url: "../register/register_service_frame.html",
                //     bounces: false,
                //     slidBackEnabled: false,
                //     bgColor: '#fff',
                //     pageParam: {
                //         serverAddress: item.address
                //     } //携参
                // });
                if (api.pageParam.page === "home-peo") {
                      api.closeWin({
                          name: 'bMap-index-win'
                      });
                      _g.execScript({
                        //   winName: 'mainBoss-index-win', // 必填 黄焱
                          winName: 'main-indexBoss-win', // 必填 0722-杨标泓改
                          frameName: 'home-peo-frame', // 可选
                          fnName: 'fnName', // 必填, 要执行的window.xxx, 只需要传入xxx
                          data: {
                              address: item.address,
                              lon: item.coord.lon, //经度
                              lat: item.coord.lat, //纬度
                          } // 可选, 规范必须传对象格式
                      });
                } else {
                    api.closeWin({
                        name: 'bMap-index-win'
                    });
                    _g.execScript({
                        winName: 'register-service-win', // 必填
                        frameName: 'register-service-frame', // 可选
                        fnName: 'fnName', // 必填, 要执行的window.xxx, 只需要传入xxx
                        data: {
                            address: item.address,
                            lon: item.coord.lon, //经度
                            lat: item.coord.lat, //纬度
                        } // 可选, 规范必须传对象格式
                    });
                }
            },
            openbMap(lon, lat) {
                var bMap = api.require('bMap');
                var self = this;
                //打开百度地图
                bMap.open({
                    rect: {
                        x: 0,
                        y: 60,
                        // w: 340,
                        h: 300
                    },
                    center: {
                        lon: lon,
                        lat: lat
                    },
                    zoomLevel: 18,
                    showUserLocation: true,
                    fixedOn: api.frameName,
                    fixed: false
                }, function(ret) {
                    if (ret.status) {
                        _g.toast('地图打开成功');

                    }
                });
                bMap.getNameFromCoords({
                    lon: lon,
                    lat: lat
                }, function(ret, err) {
                    if (ret.status) {
                        // alert(JSON.stringify(ret.poiList));
                        self.LenovoWord = ret.poiList;
                        // _g.alert(self.LenovoWord)
                    }
                });
                //!设置百度地图相关属性
                bMap.setMapAttr({
                    type: 'standard', //设置地图类型 standard（标准地图）trafficOn（打开实时路况）trafAndsate（实时路况和卫星地图）satellite（卫星地图）
                    rotateEnabled: false, //拖动手势是否可以旋转地图
                    overlookEnabled: false, //拖动手势是否可以改变地图俯视角度
                });
                //在地图上添加标注信息  (搜索出的地址)
                bMap.addAnnotations({
                    annotations: [{
                        id: 1,
                        lon: lon,
                        lat: lat
                    }],
                    icon: '',
                    draggable: false
                }, function(ret) {
                    if (ret) {
                        // alert(ret.id);
                    }
                });
                //根据经纬度设置百度地图中心点  （搜索出位置后重新定位中心点）
                bMap.setCenter({
                    coords: {
                        lon: lon,
                        lat: lat
                    },
                    animation: false
                });
                //地图显示用户位置
                // bMap.showUserLocation({
                //     isShow: true,
                //     trackingMode: 'follow'
                // });
            },
            getLocation() {
                var self = this;
                var bMap = api.require('bMap');
                bMap.getLocation({
                    accuracy: '100m',
                    autoStop: true,
                    filter: 1
                }, function(ret, err) {
                    if (ret.status == false) {
                        _g.toast("请检查手机位置权限是否开启~")
                    } else if (ret.status == true) {
                        // alert(JSON.stringify(ret));
                        self.openbMap(ret.lon, ret.lat)
                    } else {
                        _g.toast("位置获取失败！")
                    }
                });
            },
            searchMap() {
                var self = this;
                var bMap = api.require('bMap');
                bMap.getCoordsFromName({
                    // city: '北京',
                    address: self.addressName
                }, function(ret, err) {
                    if (ret.status) {
                        // alert(JSON.stringify(ret));
                        // bMap.close();
                        self.openbMap(ret.lon, ret.lat)
                    }
                });
            },

            //点击按钮，回到当前位置
            showUserLocation() {
                var map = api.require('bMap');
                map.showUserLocation({
                    isShow: true,
                    trackingMode: 'none'
                });
            }
        }
    });
    var _page = {
        initSwiper: function() {
            var swiper = new Swiper('.swiper-container', {
                // initialSlide: 4,
                speed: 3000,
                autoplay: true,
                loop: true, // 循环模式选项
                pagination: '.swiper-pagination',
                  //添加小圆点
            });
        },
    };

    _page.initSwiper();
    (function() {
        window.clipFinish = function() { //filePath
        }
    })();
    module.exports = {};
});

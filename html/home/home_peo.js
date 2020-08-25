define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/home_peo_view'),
        data: {
            flag: false,
            serverList: [],
            allServerList: [],
            address: "", //公司服务地址 - 服务商必填
            lon: "", //经度
            lat: "", //纬度
            consultList: [],
            UnreadCount:0,//消息未读总数
        },
        created: function () {
            this.selectChatUnreadCount();
            this.getLocation();
            window.fnName = function (data) {
                // main.address = data.address;
                main.lon = data.lon;
                main.lat = data.lat;
                main.openbMap(data.lon, data.lat);
                main.selectServer(data.lon, data.lat);
            };

        },
        filters: {
            dateFormat(value){
                let date = new Date(value)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()
                return year + '-' + month + '-' + day
            }
        },
        methods: {
            openRegisterBuy(id) {
                _g.openWin({
                    header: { title: '注册代办' },
                    name: "register-buy",
                    url: "../home/register_buy_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        id: id
                    } //携参
                })
            },
            //打开税讯详情
            openDetail(id) {
                _g.openWin({
                    header: {
                        title: '税讯详情'
                    },
                    name: "consult-detail",
                    url: "../home/consult_detail_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        id: id
                    }  //携参
                })
            },
            //打开每日税讯
            openConsult() {
                _g.openWin({
                    header: { title: '每日税讯' },
                    name: "everyday-consult",
                    url: "../home/everyday_consult_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                    } //携参
                })
            },
            //获取每日税讯
            getConsultList() {
                Http.ajax({
                    data: {},
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatTaxNews/getBeatTaxNewsList',
                    success: result => {
                        if (result.code === 200) {
                            console.log(result)
                            this.consultList = result.data.filter((item,index) => {
                                return index < 3
                            })
                        }
                    }
                })
            },
            openbMapPage() {
                _g.openWin({
                    header: {
                        title: '选择地址'
                    },
                    name: "bMap-index",
                    url: "../bMap/index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        page: "home-peo"
                    }  //携参
                })
            },
            
            openMessage() {
                _g.openWin({
                    header: { title: '消息列表' },
                    name: "message-list",
                    url: "../message/myMessage_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                    } //携参
                })
            },
            
            //查询聊天未读总数
            selectChatUnreadCount() {
                var url = "api/control/beatChat/selectChatUnreadCount";
                var option = {
                    data: {
                        userId: _g.getLS("userId")
                    },
                }
                Http.ajax({
                    data: option,
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.UnreadCount = ret.data;
                        }
                    },
                });
            },
            callPhone() {
                api.call({
                    type: 'tel_prompt',
                    number: '13928730269'
                });
            },
            selectServer(lon, lat) {
                var url = "api/control/beatServer/selectServerByUserLoLa"
                var option = {
                    data: {
                        latitude: lat,
                        longitude: lon
                        // latitude: "22.946995",
                        // longitude: "113.388597"
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
                    success: (ret) => {
                        this.getConsultList()
                        //!没有数据时
                        if (ret.data.length === 0) {
                            main.allServerList = [];
                            main.allServerList.push({
                                companyName: "暂无公司数据",
                                content: "暂无详细简介"
                            })
                        } else {

                            //!有数据时
                            main.allServerList = ret.data;
                            for (let i = 0; i < ret.data.length; i++) {
                                main.serverList[i] = {
                                    id: i + 1,
                                    lon: ret.data[i].longitude,
                                    lat: ret.data[i].latitude
                                }

                            }
                            var bMap = api.require('bMap');
                            bMap.addAnnotations({
                                annotations: main.serverList,
                                icon: 'widget://',
                                draggable: false
                            }, function (ret) {
                                if (ret) {
                                    var num = ret.id - 1;
                                    var companyName = main.allServerList[num].companyName;
                                    var content = main.allServerList[num].content;
                                    bMap.setBubble({
                                        id: ret.id,
                                        bgImg: 'widget://image/home-peo/alert.png',
                                        rect: {
                                            x: 10,
                                            y: 5,
                                            w: 480,
                                            h: 150
                                        },
                                        content: {
                                            title: companyName,
                                            subTitle: content,
                                            illus: 'widget://image/home-peo/fwimg.png'
                                        },
                                        styles: {
                                            titleColor: '#000',
                                            titleSize: 16,
                                            subTitleColor: '#999',
                                            subTitleSize: 12,
                                            illusAlign: 'left',
                                            w: 480,
                                            h: 150
                                        }
                                    }, function (ret) {
                                        if (ret) {
                                            // alert(JSON.stringify(ret));
                                            //!最终详细弹框
                                        }
                                    });
                                }
                            });
                        }
                    }
                })
            },
            openbMap(lon, lat) {
                var bMap = api.require('bMap');
                var self = this;
                //打开百度地图
                bMap.open({
                    rect: {
                        x: 0,
                        y: 145,
                        // w: 340,
                        h: 210
                    },
                    center: {
                        lon: lon,
                        lat: lat
                    },
                    zoomLevel: 18,
                    showUserLocation: true,
                    fixedOn: api.frameName,
                    fixed: false
                }, function (ret) {
                    if (ret.status) {
                        _g.toast('地图打开成功');
                    }
                });
                bMap.getNameFromCoords({
                    lon: lon,
                    lat: lat
                }, function (ret, err) {
                    if (ret.status) {
                        // alert(JSON.stringify(ret));
                        self.LenovoWord = ret.poiList;
                        main.address = ret.poiList[0].name;
                    }
                });
                //!设置百度地图相关属性
                bMap.setMapAttr({
                    type: 'standard', //设置地图类型 standard（标准地图）trafficOn（打开实时路况）trafAndsate（实时路况和卫星地图）satellite（卫星地图）
                    rotateEnabled: false, //拖动手势是否可以旋转地图
                    overlookEnabled: false, //拖动手势是否可以改变地图俯视角度
                });

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
            // 打开开票页面
            openMakeInvoices() {
                _g.openWin({
                    header: {
                        title: '开票'
                    },
                    name: "makeInvoices-index",
                    url: "../makeInvoices/makeInvoices_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 打开工商页面
            openCommercial() {
                _g.openWin({
                    header: {
                        title: '工商'
                    },
                    name: "commercial-index",
                    url: "../commercial/commercial_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 打开服务商列表页面
            openServerList() {
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
            },
            //打开e税课程
            openeTaxClass() {
                _g.openWin({
                    header: { 
                        title: 'e税学堂',
                        rightIcon: '发布问题',
                        rightText: '发布问题'
                    },
                    name: "eTaxClass-index",
                    url: "../eTaxClass/eTaxClass_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                    } //携参
                })
            },
            // 打开单据审核页面
            openReview() {
                _g.openWin({
                    header: { title: '单据审核' },
                    name: "review-index",
                    url: "../review/review_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })


                // _g.openWin({
                //     header: { title: "测试" },
                //     name: "sss-details",
                //     url: "../uploader/uploader_frame.html",
                //     bounces: false,
                //     slidBackEnabled: false,
                //     bgColor: "#fff",
                //     pageParam: {
                //     }, //携参
                // });
            },
            
            // 打开会计页面 - 即全部套餐
            openPackage(){
                _g.openWin({
                    header: { title: "全部套餐" },
                    name: "index_allPackage",
                    url: "../myPackage/index_allPackage_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: "#fff",
                    pageParam: {}, //携参
                  });
            },
            // 打开单据审批页面
            openExamine() {
                _g.openWin({
                    header: { title: '单据审批' },
                    name: "examine-index",
                    url: "../examine/examine_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
        }
    });

    (function () {

    })();
    module.exports = {};
});

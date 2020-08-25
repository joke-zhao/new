define(function (require, exports, module) {
    var Http = require('U/http');
    var imageClip = require('U/ImageClip');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/index_view'),
        data: {
            date: '',
            address:'',
            show: false,
            dialogShow: false,
            typeShow: 1, //根据登陆者类型进行部分功能的显示隐藏
            swiperList: [
                {
                    swiper: "../../image/home/swiper.png",
                    id: 0,
                },
                {
                    swiper: "../../image/home/swiper1.png",
                    id: 1,
                },
                {
                    swiper: "../../image/home/swiper2.png",
                    id: 2,
                },
            ],
            isShow: false,
            consultList: [],
            UnreadCount:0,//消息未读总数
        },
        created: function () {
            this.selectChatUnreadCount();
            this.typeShow = Number(_g.getLS('roleId'))
            // _g.clearLS()
            this.getLocation()
            this.getConsultList()
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
            // 获取当前定位
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
                        main.address = '定位失败'
                    } else if (ret.status == true) {
                        // alert(JSON.stringify(ret));
                        var lon = ret.lon;
                        var lat = ret.lat;
                        self.openbMap(lon, lat);
                    } else {
                        main.address = '定位失败'
                        _g.toast("位置获取失败！")
                    }
                });
            },
            openbMap(lon, lat) {
                var bMap = api.require('bMap');
                var self = this;
                bMap.getNameFromCoords({
                    lon: lon,
                    lat: lat
                }, function(ret, err) {
                    if (ret.status) {
                        main.address = ret.poiList[0].name;
                    }
                });
            },
            onPicTap: function () {
                _g.execScript({
                    winName: _g.getLS('rootWinName'),
                    fnName: 'reloadApp'
                });
            },
            callPhone() {
                api.call({
                    type: 'tel_prompt',
                    number: '13928730269'
                });
            },
            //! 拍照上传 新增纳税人
            openCamera() {
                imageClip.openPicActionSheet()
                // api.getPicture({
                //     sourceType: 'camera',
                //     encodingType: 'jpg',
                //     mediaValue: 'pic',
                //     destinationType: 'url',
                //     allowEdit: true,
                //     quality: 100,
                //     //TODO width和height 可以设置图片的大小   不传为原图
                //     targetWidth: 2160,
                //     targetHeight: 2160,
                //     saveToPhotoAlbum: true,
                //     groupName: "拍账王"
                // }, function (ret, err) {
                //     if (ret) {
                //         if (!ret.data) {
                //             _g.toast("取消了打开相机~")
                //         } else {
                //             var filePath = ret.data;
                //             var url = "api/control/beatCompany/batchUpload";
                //             Http.ajax({
                //                 data: { files: filePath },
                //                 isFile: true,
                //                 isJson: false,
                //                 method: "post",
                //                 time: [], //组长做了判断，加time时请求头会带userId
                //                 isSync: true,
                //                 lock: false,
                //                 url: url,
                //                 success: function (ret) {
                //                     if (ret.code == 200) {
                //                         var dataList = ret.data;
                //                         // _g.alert(dataList)
                //                         _g.openWin({
                //                             header: { title: '拍照识别' },
                //                             name: "addTaxpayer-auto",
                //                             url: "../addTaxpayer/addTaxpayer_auto_frame.html",
                //                             bounces: false,
                //                             slidBackEnabled: false,
                //                             bgColor: '#fff',
                //                             pageParam: {
                //                                 dataList: dataList,
                //                                 methods: "photo",//album为相册，photo为相机
                //                             } //携参
                //                         })
                //                     }
                //                 }
                //             })
                //             //TODO接口调用
                //             // var url = "upload/storageObj?type=1";
                //             // var data = {
                //             //     file: filePath
                //             // }
                //             // Http.ajax({
                //             //     data: data,
                //             //     isFile: true,
                //             //     method: "post",
                //             //     isSync: true,
                //             //     isJson: false,
                //             //     lock: false,
                //             //     url: url,
                //             //     success: function (ret) {
                //             //         // alert(JSON.stringify(ret))
                //             //         if (ret.code == 200) {
                //             //             // alert(ret.data.realPath)
                //             //             //TODO二次接口调用
                //             //             var url = "ocr/business";
                //             //             var data = {
                //             //                 data: ret.data.realPath
                //             //             }
                //             //             Http.ajax({
                //             //                 data: data,
                //             //                 isFile: false,
                //             //                 method: "post",
                //             //                 isJson: true,
                //             //                 isSync: true,
                //             //                 lock: false,
                //             //                 url: url,
                //             //                 success: function (ret) {
                //             //                     if (ret.code == 200) {
                //             //                         var dataList = ret.data;
                //             //                         _g.openWin({
                //             //                             header: { title: '拍照识别' },
                //             //                             name: "addTaxpayer-auto",
                //             //                             url: "../addTaxpayer/addTaxpayer_auto_frame.html",
                //             //                             bounces: false,
                //             //                             slidBackEnabled: false,
                //             //                             bgColor: '#fff',
                //             //                             pageParam: {
                //             //                                 dataList:dataList,
                //             //                             } //携参
                //             //                         })
                //             //                     }
                //             //                 },
                //             //             });
                //             //         }
                //             //     },
                //             // });
                //         }
                //     } else {
                //         // alert(JSON.stringify(err));
                //         _g.alert("取消了拍照~");
                //     }
                // });
            },
            //! 相册上传 新增纳税人
            openAlbum() {
                var UIAlbumBrowser = api.require('UIAlbumBrowser');
                UIAlbumBrowser.open({
                    max: 9,
                    styles: {
                        bg: '#fff',//（可选项）字符串类型；资源选择器背景，支持 rgb，rgba，#；默认：'#FFFFFF'
                        mark: {//（可选项）JSON对象；选中图标的样式
                            icon: '', //（可选项）字符串类型；图标路径（本地路径，支持fs://、widget://）；默认：对勾图标
                            position: 'top_right',//（可选项）字符串类型；图标的位置，默认：'bottom_left'
                            // 取值范围：
                            // top_left（左上角）
                            // bottom_left（左下角）
                            // top_right（右上角）
                            // bottom_right（右下角）
                            size: 20//（可选项）数字类型；图标的大小；默认：显示的缩略图的宽度的三分之一
                        },
                        texts: {
                            stateText: '已选择*项',
                            cancelText: '取消',
                            finishText: '完成'
                        },
                        nav: {                              //（可选项）JSON对象；导航栏样式
                            bg: 'rgba(0,0,0,1)',                     //（可选项）字符串类型；导航栏背景，支持 rgb，rgba，#；默认：'#eee'
                            stateColor: '#fff',             //（可选项）字符串类型；状态文字颜色，支持 rgb，rgba，#；默认：'#000'
                            stateSize: 18,                  //（可选项）数字类型；状态文字大小，默认：18
                            cancelBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；取消按钮背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            cancelColor: '#fff',            //（可选项）字符串类型；取消按钮的文字颜色；支持 rgb，rgba，#；默认：'#000'
                            cancelSize: 16,                 //（可选项）数字类型；取消按钮的文字大小；默认：18
                            finishBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；完成按钮的背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            finishColor: '#fff',            //（可选项）字符串类型；完成按钮的文字颜色，支持 rgb，rgba，#；默认：'#000'
                            finishSize: 16                  //（可选项）数字类型；完成按钮的文字大小；默认：18
                        }
                    },
                    rotation: true
                }, function (ret) {
                    if (ret.eventType === "cancel") {
                        _g.toast("您取消了上传哦~")
                    }
                    if (ret.eventType === "confirm") {
                        // alert(JSON.stringify(ret.list));
                        var url = "api/control/beatCompany/batchUpload";
                        var filePaths = ret.list;
                        // alert(files.length)
                        var pathList = [];
                        var timeList = [];
                        for (let i = 0; i < filePaths.length; i++) {
                            pathList.push(filePaths[i].path)
                            timeList.push(new Date().Format("yyyy-MM-dd hh:mm:ss:S"))
                        }
                        // alert(files)
                        Http.ajax({
                            data: { files: pathList },
                            isFile: true,
                            isJson: false,
                            method: "post",
                            time: timeList,
                            isSync: true,
                            lock: false,
                            url: url,
                            success: function (ret) {
                                if (ret.code == 200) {
                                    var dataList = ret.data;
                                    _g.openWin({
                                        header: { title: '营业执照列表' },
                                        name: "addTaxpayer-licenseList",
                                        url: "../addTaxpayer/licenseList_frame.html",
                                        bounces: false,
                                        slidBackEnabled: false,
                                        bgColor: '#fff',
                                        pageParam: {
                                            dataList: dataList,
                                            methods: "album",//album为相册，photo为相机
                                        } //携参
                                    })
                                }
                            }
                        })
                    }
                });
                // api.getPicture({
                //     sourceType: 'album',
                //     encodingType: 'jpg',
                //     mediaValue: 'pic',
                //     destinationType: 'url',
                //     allowEdit: true,
                //     quality: 100,
                //     targetWidth: 720,
                //     targetHeight: 720,
                //     saveToPhotoAlbum: false
                // }, function (ret, err) {
                //     if (ret) {
                //         if (!ret.data) {
                //             _g.toast("取消了打开相册~")
                //         } else {
                //             //TODO接口调用
                //             var url = "upload/storageObj?type=1";
                //             var data = {
                //                 file: ret.data
                //             }
                //             Http.ajax({
                //                 data: data,
                //                 isFile: true,
                //                 method: "post",
                //                 isSync: true,
                //                 lock: false,
                //                 url: url,
                //                 success: function (ret) {
                //                     if (ret.code == 200) {
                //                         // alert(ret.data.realPath)
                //                         //TODO二次接口调用
                //                         var url = "ocr/business";
                //                         var data = {
                //                             data: ret.data.realPath
                //                         }
                //                         Http.ajax({
                //                             data: data,
                //                             isFile: false,
                //                             method: "post",
                //                             isJson: true,
                //                             isSync: true,
                //                             lock: false,
                //                             url: url,
                //                             success: function (ret) {
                //                                 if (ret.code == 200) {
                //                                     _g.alert(ret.data)
                //                                 }
                //                             },
                //                         });
                //                     }
                //                 },
                //             });
                //         }

                //     } else {
                //         _g.alert("取消了打开相册~");
                //     }
                // });
            },
            //! 打开新增纳税人界面 - 手动录入
            openAddTaxpayer_manual() {
                _g.openWin({
                    header: { title: '手动录入' },
                    name: "addTaxpayer-manual",
                    url: "../addTaxpayer/addTaxpayer_manual_frame.html",
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
            // 打开手工输入页面
            openReviewManual() {
                _g.openWin({
                    header: { title: '手工输入' },
                    name: "reviewManual-index",
                    url: "../reviewManual/reviewManual_index_frame.html",
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
            // 打开跑腿页面
            openLegwork() {
                _g.openWin({
                    header: { title: '跑腿' },
                    name: "legwork-index",
                    url: "../legwork/legwork_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 打开工商页面
            openCommercial() {
                _g.openWin({
                    header: { title: '工商' },
                    name: "commercial-index",
                    url: "../commercial/commercial_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
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
            // 打开开票页面
            openMakeInvoices() {
                _g.openWin({
                    header: { title: '开票' },
                    name: "makeInvoices-index",
                    url: "../makeInvoices/makeInvoices_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
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
            // 打开贷款页面
            openLoan(){
                _g.openWin({
                    header: { title: "贷款" },
                    name: "index_loan",
                    url: "../loan/loan_index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: "#fff",
                    pageParam: {}, //携参
                });
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
                                return index < 4
                            })
                        }
                    }
                })
            }
        }
    });
    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {
                // initialSlide: 4,
                speed: 3000,
                autoplay: true,
                loop: true, // 循环模式选项
                pagination: '.swiper-pagination', //添加小圆点
            });
        },
    };

    // _g.setPullDownRefresh(function () {
    //     // this.getxxxlist()
    // })



    _page.initSwiper();
    (function () {
        window.clipFinish = function (Path) {
            Path = api.fsDir + Path.replace('fs:/', '')
            var filePath = Path;
            var url = "api/control/beatCompany/batchUpload";
            Http.ajax({
                data: { files: filePath },
                isFile: true,
                isJson: false,
                method: "post",
                time: [], //组长做了判断，加time时请求头会带userId
                isSync: true,
                lock: false,
                url: url,
                success: function (ret) {
                    if (ret.code == 200) {
                        var dataList = ret.data;
                        // _g.alert(dataList)
                        _g.openWin({
                            header: { title: '拍照识别' },
                            name: "addTaxpayer-auto",
                            url: "../addTaxpayer/addTaxpayer_auto_frame.html",
                            bounces: false,
                            slidBackEnabled: false,
                            bgColor: '#fff',
                            pageParam: {
                                dataList: dataList,
                                methods: "photo",//album为相册，photo为相机
                            } //携参
                        })
                    }
                }
            })
        }
    })();
    module.exports = {
    };
});

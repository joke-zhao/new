define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('legwork/order_send_view'),
        data: {
            obj:{},
            runid:'',
            userId:'',
            nikename:'暂无信息',
            phone:'暂无信息',
            isPay:false,
            payFlag: 0, //支付方式标志
            payList: [
                { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
                { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
            ]

        },
        created:function(){
            this.runid = api.pageParam.runid;
            this.userId = _g.getLS('userId');
            console.log(this.runid);
            this.getDetail();
        },
        filters: {
          formatDate(val) {
              let date = new Date(val).Format('yyyy-MM-dd hh:mm')
              return date ;
          },
            formatDateToMonth(val) {
                let date = new Date(val)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDay()
                let hh = date.getHours()
                let ss = date.getMinutes()
                return month+'月'+day+'日'+' '+hh+ ':' + ss ;
            },
            statusText(val){
                if(val==='waitOrder')
                    return '待接单';
                if(val==='waitConfirm'||val==='underway')
                    return '进行中';
                if(val==='finished'||val==='closed')
                    return '结束';
            },
            statusSubmit(val){
                if(val==='waitOrder')
                    return '关闭订单';
                if(val==='waitConfirm'||val==='underway')
                    return '确认收货';
                if(val==='finished'||val==='closed')
                    return '结束';
            },
            empty(value){
                if(!String(value)){
                    return '暂无信息';
                }
                else{
                    return value;
                }

            }
        },
        methods: {
            getDetail(){
                var self = this;
                Http.ajax({
                    data: {
                        data:{
                            runErrandId: self.runid,
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: 'api/control/beatRunErrand/view',
                    success: (res) =>{
                        console.log(res);
                        main.obj = res.data;
                        if(res.data.receiveUser){
                            self.nikename = res.data.receiveUser.nickname;
                            self.phone = res.data.receiveUser.phone;
                        }
                    }
                })
            },
            submit(){
                var self = this;
                if(self.obj.status === 'waitOrder'){
                    console.log(self.obj.status)
                    Http.ajax({
                        data: {
                            data:{
                                runErrandId: self.runid,
                                sendUserId: self.userId
                            }
                        },
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: 'api/control/beatRunErrand/close',
                        success: (res) =>{
                            _g.toast(res.data);
                            self.getDetail();
                        }
                    })
                }
                if(self.obj.status === 'waitConfirm'|| self.obj.status === 'underway'){
                    console.log(self.obj.status)
                    console.log(self.runid);
                    console.log(self.userId);
                    Http.ajax({
                        data: {
                            data:{
                                runErrandId: self.runid,
                                sendUserId: self.userId
                            }
                        },
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: 'api/control/beatRunErrand/sendConfirm',
                        success: (res) =>{
                            if(res.code == 200){
                                _g.toast(res.data);
                                self.openOrder();
                            }else{
                                _g.toast("服务异常");
                                self.getDetail();
                            }


                        }
                    })
                }

            },
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

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {
                // direction: 'horizontal',
                // initialSlide: 0,
                // autoplay: 1000
                // autoplayStopOnLast: true
            });
            // var homeBanner = new Swiper('#banner', {
            //     direction: 'horizontal',
            //     loop: true,
            //     autoplay: 5000,
            //     pagination: '#banner .swiper-pagination',
            //     bulletActiveClass: 'is-active',
            //     autoplayDisableOnInteraction: false,
            //     onSliderMove: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: false
            //         });
            //     },
            //     onTouchEnd: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: true
            //         });
            //     },
            // })
        }
    };
    //_page.initSwiper();

    (function () {

    })();
    module.exports = {};
});

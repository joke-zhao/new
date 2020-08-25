define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('legwork/order_receive_view'),
        data: {
            userId:'',
            runid:'',
            obj:{},
            nikename:'暂无信息',
            phone:'暂无信息'
        },
        filters: {

          empty(value){
              if(!String(value)){
                  return '暂无信息';
              }
              else{
                  return value;
              }

          },
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
                if(val==='underway')
                    return '进行中';
                if(val==='waitConfirm')
                    return '待收款';
                if(val==='finished'||val==='closed')
                    return '结束';
            },
            statusSubmit(val){
                if(val==='underway')
                    return '送货完成';
                if(val==='waitConfirm')
                    return '待收款';
                if(val==='finished'||val==='closed')
                    return '结束';
            }
        },
        created:function(){
            this.runid = api.pageParam.runid;
            this.userId = _g.getLS('userId');
            console.log(this.runid);
            this.getDetail();
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
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatRunErrand/view',
                    success: (res) =>{
                        console.log(res);
                        self.obj = res.data;
                        if(res.data.sendUser){
                            self.nikename = res.data.sendUser.nickname;
                            self.phone = res.data.sendUser.phone;
                        }
                    }
                })
            },
            submit(){
                var self = this;
                if(self.obj.status === 'underway'){
                    console.log(self.obj.status)
                    Http.ajax({
                        data: {
                            data:{
                                runErrandId: self.runid,
                                receiveUserId: self.userId
                            }
                        },
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: 'api/control/beatRunErrand/receiveConfirm',
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

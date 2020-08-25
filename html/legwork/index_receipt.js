define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('legwork/index_receipt_view'),
        data: {
            id:'',
            infos:{},
            nickname:'',
            phone:''

        },
        created:function(){
            this.id = api.pageParam.id;
            console.log(this.id);
            this.getInfo(this.id);
        },
        filters: {
            formatDate(date) {
                if(date==null){
                    return '暂无信息';
                }
                var date = new Date(date);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())+'日';
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return MM + DD+' '+hh+mm;
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
            getInfo(id){
                Http.ajax({
                    data: {
                        data:{
                            runErrandId: id
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
                        main.infos = res.data;
                        console.log(res.data.sendUser.nickname);
                        if(res.data.sendUser){
                          main.nickname = res.data.sendUser.nickname;
                          main.phone = res.data.sendUser.phone;
                        }
                        console.log(main.infos);
                    }
                })
            },
            submitReceipt(){
                var userId = _g.getLS("userId");
                Http.ajax({
                    data: {
                        data:{
                            runErrandId: main.id,
                            //userId
                            receiveUserId:userId
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatRunErrand/receive',
                    success: (res) =>{
                        console.log(res);
                        if(res.code==200){
                            _g.toast(res.message);
                            _g.execScript({
                                winName:'legwork-index-win',
                                frameName: 'legwork-index-frame',
                                fnName:'closeAndRefresh'
                            })


                        }
                        else{
                            _g.toast("服务异常")
                        }
                        // main.infos = res.data;
                        // console.log(main.infos);
                    }
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

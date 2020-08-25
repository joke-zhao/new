define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var vant = require('L/vant/vant.min.js')
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('my/my_customer_view'),
        data: {
            customerList: [],
            customerName: ''
        },
        components: {
            vant
        },
        created: function () {
            this.getCustomerList()
        },
        filters: {

        },
        methods:{
            getCustomerList() {
                Http.ajax({
                    data: {
                        data: {
                            //_g.getLS('userId')
                            //2c9274f6737ef5ab0173801073db004a,001
                            userId: _g.getLS('userId')
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatCompany/selectMyCompany',
                    success: result => {
                        if (result.code === 200) {
                            this.customerList = result.data
                        }
                    }
                })
            },
            onSearch(value) {
                Http.ajax({
                    data: {
                        data: {
                            //_g.getLS('userId')
                            //2c9274f6737ef5ab0173801073db004a,001
                            userId: _g.getLS('userId'),
                            company: value
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatCompany/selectMyLikeCompany',
                    success: result => {
                        if (result.code === 200) {
                            this.customerList = result.data
                            this.customerName = ''
                        }
                    }
                })
            },
            onCancel() {

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

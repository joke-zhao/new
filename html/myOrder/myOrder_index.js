define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('myOrder/myOrder_index_view'),
        data: {
            // tabs栏
            tabs: [
                {
                    id: 1,
                    text: '全部',
                    isActive: true
                },
                {
                    id: 2,
                    text: '待确认',
                    isActive: false
                },
                {
                    id: 3,
                    text: '进行中',
                    isActive: false
                }
            ]
        },
        filters: {

        },
        methods: {
            // 切换状态栏
            toggleTab(index) {
                this.tabs.forEach(v => {
                    v.isActive = false
                })
                this.tabs[index].isActive = true
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

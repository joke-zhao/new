define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('login/privacy_view'),
        data: {
            show: false,
            phone: "",
            password: ""
        },
        created: function () {},
        filters: {

        },
        methods: {}
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

    _page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

define(function (require, exports, module) {
    var Http = require('U/http');

    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('main/mainFooter_view'),
        data: {
            pageActiveIndex: 0,
            page: [
                {
                    icon: 'is-home',
                    title: '首页',
                    openFlag: true
                },
                {
                    icon: 'is-door',
                    title: '开门',
                    openFlag: false
                },
                {
                    icon: 'is-bbs',
                    title: '论坛',
                    openFlag: false
                },
                {
                    icon: 'is-me',
                    title: '我的',
                    openFlag: false
                }
            ]
        },
        created: function () {

        },
        ready: function () {
            // _g.
            var safeAreaBottom = parseInt(_g.getLS('safeAreaBottom'));
            if (safeAreaBottom) $('#footer').css('padding-bottom', safeAreaBottom + 'px');
            $('#header').css('padding-top', _g.getLS('StatusBarHeight') + 'px');
            setTimeout(function () {
                headerHeight = $('#header').height();
                footerHeight = $('#footer').height();
            }, 0);
        },
        filters: {

        },
        methods: {
            onFooterTap: function (index) {
                if (index === main.pageActiveIndex) return;
                main.pageActiveIndex = index;
                main.page[index].openFlag = true;
            },
        },
    });

    var _page = {

    };

    var sendApi = {

    };

    (function () {

    })();
    module.exports = {};
});

define(function (require, exports, module) {
    var Http = require('U/http');

    // _g.setLS('SessionKey', '57de1990f97b41a7bbab7fb883483bf6');

    // Http.ajax({
    //     data: {},
    //     url: '/admin/account/login.do',
    //     isSync: false,
    //     lock: false,
    //     success: function (ret) {
    //         if (ret.code == 200) {
    //             _g.setLS('ActiveHouse', ret.data);
    //             opts.suc && opts.suc(ret.data);
    //             api.sendEvent({
    //                 name: 'checkHouse',
    //             })
    //         } else if (ret.code == 3003) {
    //             opts.fail && opts.fail();
    //             if (!opts.from) {
    //                 _g.execScript({
    //                     winName: _g.getLS('rootWinName'),
    //                     fnName: 'loseActiveHouse'
    //                 });
    //             }
    //         }
    //     }
    // });


    var headerHeight = 0;
    var footerHeight = 0;

    // api && api.setStatusBarStyle({
    //     style: 'dark'
    // });

    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.closeWidget();
        // if (window.firstQuit) {
        // } else {
        //     window.firstQuit = true;
        //     setTimeout(function () {
        //         window.firstQuit = false;
        //     }, 500);
        // }
    });


    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('main/indexBoss_view'),
        data: {
            showMainFooter: true,
            pageActiveIndex: 0,
            page: [
                {
                    icon: 'is-home',
                    title: '首页',
                    openFlag: true
                },
                {
                    icon: 'is-pai',
                    title: '拍一拍',
                    openFlag: false
                },
                {
                    icon: 'is-dan',
                    title: '单据审批',
                    openFlag: false
                },
                {
                    icon: 'is-bao',
                    title: '报表',
                    openFlag: false
                },
                {
                    icon: 'is-me',
                    title: '我的',
                    openFlag: false
                },
            ]
        },
        created: function () {
        },
        mounted: function () {
            var safeAreaBottom = parseInt(_g.getLS('safeAreaBottom'));
            if (safeAreaBottom) $('#footer').css('padding-bottom', safeAreaBottom + 'px');
            $('#header').css('padding-top', _g.getLS('StatusBarHeight') + 'px');
            setTimeout(function () {
                headerHeight = $('#header').height();
                footerHeight = $('#footer').height();
                window.MainFrameGroup.open();
            }, 0);
        },
        filters: {},
        methods: {
            onFooterTap: function (index) {
                if (index === main.pageActiveIndex) return;
                main.pageActiveIndex = index;
                main.page[index].openFlag = true;
                window.MainFrameGroup.setIndex(index);
            },
            onEntryTap: function (type) {
                var action = {
                        // message: function () {
                        //     _g.openWin({
                        //         header: {
                        //             title: '消息中心',
                        //             rightText: '清空消息'
                        //         },
                        //         name: 'home-msg',
                        //         url: '../home/msg_frame.html',
                        //         bounces: true,
                        //         slidBackEnabled: false,
                        //         bgColor: '#fff',
                        //         pageParam: {
                        //             to: 'msg'
                        //         }
                        //     });
                        // },
                        // bbs: function () {
                        //     _g.openWin({
                        //         header: {
                        //             title: '我相关的'
                        //         },
                        //         name: 'forum-relatedToMe',
                        //         url: '../forum/relatedToMe_frame.html',
                        //         bounces: true,
                        //         slidBackEnabled: false,
                        //         bgColor: '#fff'
                        //     });
                        // }
                    };
                    action[type] && action[type]();
                }
            },
        });

    var sendApi = {}

    window.MainFrameGroup = {
        open: function () {
            console.log(headerHeight, footerHeight);
            api.openFrameGroup({
                name: 'main-group',
                scrollEnabled: false,
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    // h: winHeight - headerHeight - footerHeight
                    marginBottom: footerHeight + 1
                },
                index: 0,
                preload: 0,
                frames: [{
                    name: 'home-peo-frame',
                    url: '../home/home_peo_frame.html',
                    bounces: false,
                    bgColor: '#fff'
                },
                {
                    name: 'pat-index-frame',
                    url: '../pat/pat_index_frame.html',
                    bounces: false,
                    bgColor: '#fff'
                },
                {
                    name: 'examine-index-frame',
                    url: '../examine/examine_index_frame.html',
                    bounces: true
                }, 
                {
                    name: 'reportForm-index-frame',
                    url: '../reportForm/reportForm_index_frame.html',
                    bounces: false,
                    bgColor: '#fff'
                }, {
                    name: 'my-index-frame',
                    url: '../my/my_index_frame.html',
                    bounces: false,
                    bgColor: '#fff'
                }]
            }, function (ret, err) {
                console.log(ret);
                console.log(err);

            });
        },
        setIndex: function (index) {
            api.setFrameGroupIndex({
                name: 'main-group',
                index: index
            });
        }
    };

    (function () {
        window.frameReady = function () {

        };
        window.footerTap = function (data) {
            main.onFooterTap(data.index);
        };
        window.loginSuc = function () {

        };

        window.refreshData = function () {
            _g.getActiveHouse({
                Http: Http
            });
            _.each(main.page, function (value, index) {
                if (value.openFlag) {
                    var frameName = '';
                    switch (index) {
                        case 0:
                            frameName = 'home-peo-frame'
                            break;
                        case 1:
                            // frameName = 'home-class-frame'
                            frameName = 'pat-index-frame'
                            break;
                        case 2:
                            frameName = 'reportForm-index-frame'
                            break;
                        case 3:
                            frameName = 'my-index-frame'
                            break;
                    }
                    if (index != 1) {
                        _g.execScript({
                            winName: 'main-index-win',
                            frameName: frameName,
                            fnName: 'resetHouse'
                        });
                    }
                }
            })
        }
    })();


    module.exports = {};

});

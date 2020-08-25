define(function (require, exports, module) {
    var Http = require('U/http');
    api && api.setFullScreen({
        fullScreen: false
    });

    // var logCrash = api.require('logCrash');
    // logCrash.listenCrash();

    api && api.setStatusBarStyle({
        style: 'dark'
    });

    if (window.APPMODE == 'dev' && !window.location.host) {
        api.clearCache();
        api.removeLaunchView();

        var path = _g.getLS('DEV_PATH');

        if (path) {
            api.confirm({
                title: '提示',
                msg: '使用历史记录地址',
                buttons: ['确定', '取消']
            }, function (ret, err) {
                if (ret.buttonIndex == 1) {
                    openDev(path);
                } else {
                    inputPath();
                }
            });
        } else {
            inputPath();
        }

        // var config = require('config');
        // var url = 'http://' + config.host + ':' + config.port;

        function openDev(path) {
            api.openWin({
                name: 'dev-win',
                url: path + '/index.html?isApp=1',
                bounces: false,
                slidBackEnabled: false,
                pageParam: { key: 'value' },
                animation: { type: 'none' }
            });
        }

        function inputPath() {
            api.prompt({
                buttons: ['确定', '取消']
            }, function (ret, err) {
                if (ret.buttonIndex == 1) {
                    path = 'http://' + ret.text;
                    _g.setLS('DEV_PATH', path);
                    openDev(path);
                } else {
                    api.closeWidget({
                        silent: true
                    });
                }
            });
        }

        return
    }

    // _g.rmLS('isFirstStart');
    // if (api.systemType == 'android') {
    // _g.rmLS('UserInfo');
    // _g.rmLS('SessionKey');
    // }

    // 如果是第一次打开app, 启动引导页
    // if (!_g.getLS('isFirstStart')) {
    //     _g.setLS('isFirstStart',true);
    //     openLead();
    // } else 
    if (!_g.getLS('token')) {
        openLoginPage();
    } else {
        if(_g.getLS('roleId') == 2){
            // 添加app页面退出 纳税人老板能返回老板页 -- 杨标泓0714
            openMainBossPage()
        }else{
            openMainPage();
        }
    }

    //利用本地缓存做用户登录状态保持
    var startTime = new Date().getTime();
    var LastTime = _g.getLS('LastTime');
    if (!LastTime) _g.setLS('LastTime', startTime);
    if (startTime - LastTime > 7 * 24 * 60 * 60 * 1000) {
        _g.rmLS('token');
    }
    _g.setLS('LastTime', startTime);

    // 移除启动页, 应该在确定必要页面加载完毕之后调用
    // api.removeLaunchView();
    api.removeLaunchView({
        animation: {
            type: 'fade',
            duration: 500
        }
    });

    // 获取状态栏高度, 并设置至缓存
    var StatusBarHeight = _g.getStatusBarHeight();
    _g.setLS('StatusBarHeight', StatusBarHeight);

    if (api.deviceModel.indexOf('iPhone10') > -1) {
        if (['1', '2', '4', '5'].indexOf(api.deviceModel.split(',')[1].trim()) > -1) {
            _g.setLS('safeAreaBottom', 0);
        } else {
            _g.setLS('safeArea', api.safeArea);
            _g.setLS('safeAreaBottom', api.safeArea.bottom - 20);
        }
    } else {
        if (api.deviceModel.indexOf('iPhone11') > -1) {
            _g.setLS('safeArea', api.safeArea);
            _g.setLS('safeAreaBottom', api.safeArea.bottom - 20);
        } else {
            _g.setLS('safeAreaBottom', 0);
        }
    }
    

    //打开引导页
    function openLead () {
        _g.openWin({
            name: 'lead-index',
            url: './html/lead/index_frame.html',
            bounces: false,
            slidBackEnabled: false,
            animation: {type: 'none'}
        }, 'normal');
    }

    function openMainPage() {
        _g.openWin({
            name: 'main-index',
            url: './html/main/index_win.html',
            bounces: false,
            slidBackEnabled: false,
            animation: {type: 'none'}
        }, 'normal');
    }
    // 添加app页面退出 纳税人老板能返回老板页 -- 杨标泓0714
    function openMainBossPage() {
        _g.openWin({
            // name: 'mainBoss-index',
            name: 'main-indexBoss', //0722-杨标泓改
            url: './html/main/indexBoss_win.html',
            bounces: false,
            slidBackEnabled: false,
            animation: {type: 'none'}
        }, 'normal');
    }

    
    function openLoginPage() {
        _g.openWin({
            name: 'login-index',
            url: './html/login/index_frame.html',
            bounces: false,
            slidBackEnabled: false,
            animation: {type: 'none'}
        }, 'normal');
    }
    // openMainPage();

    // var ajpush = api.require('ajpush');
    // var bMap = api.require('bMap');

    // var _push = {
    //     init: function () {
    //         if (api.systemType == 'android') {
    //             ajpush.init(function (ret) {
    //                 if (ret && ret.status) {
    //                     // 这里只是短暂的注释
    //                     // _push.isPushStopped();
    //                     api.addEventListener({
    //                         name: 'appintent'
    //                     }, function (ret, err) {
    //                         if (ret && ret.appParam.ajpush) {
    //                             _push.noticeAction(ret);
    //                         }
    //                     });
    //                 }
    //             });
    //         } else {
    //             // 这里只是短暂的注释
    //             // _push.isPushStopped();
    //             // api.addEventListener({
    //             //     name: 'noticeclicked'
    //             // }, function (ret, err) {
    //             //     //TODO 这里可以监听到
    //             //     _g.alert(ret)
    //             //     console.log((_g.j2s(ret)));
    //             //     _push.noticeAction(ret);
    //             // });
    //             // ajpush.setListener(
    //             //     function(ret) {
    //             //          var id = ret.id;
    //             //          var title = ret.title;
    //             //          var content = ret.content;
    //             //          var extra = ret.extra;
    //             //     }
    //             // );
    //         }
    //     },
    //     noticeAction: function (ret) {
    //         if (!ajpush) return;
    //         var extra = null;
    //         if (api.systemType === 'android') {
    //             extra = ret.appParam.ajpush.extra;
    //         } else {
    //             extra = ret.value.extra;
    //         }
    //         if (!_.isEmpty(extra)) {
    //             MsgUtil.action(extra);
    //         }
    //     },
    //     removeListener: function () {
    //         ajpush.removeListener();
    //     },
    //     stopPush: function () {
    //         ajpush.stopPush(function (ret) {
    //             if (ret && ret.status) {
    //             } else {
    //                 _push.isPushStopped();
    //             }
    //         });
    //     },
    //     resumePush: function () {
    //         ajpush.resumePush(function (ret) {
    //             if (ret && ret.status) {
    //                 //success
    //                 _push.bindAliasAndTags();
    //             } else {
    //                 _push.isPushStopped();
    //             }
    //         });
    //     },
    //     isPushStopped: function () {
    //         //当未登录时,需要去停止推送
    //         ajpush.isPushStopped(function (ret) {
    //             if (ret && !ret.isStopped && !_g.getLS('SessionKey')) {
    //                 //未登录
    //                 _push.stopPush();
    //             } else if (ret && ret.isStopped && _g.getLS('SessionKey')) {
    //                 //已登录
    //                 _push.resumePush();
    //             } else if (ret && !ret.isStopped && _g.getLS('SessionKey')) {
    //                 _push.bindAliasAndTags();
    //             }
    //         });
    //     },
    //     setBadge: function (num) {
    //         //设置右上角未读消息数
    //         if (api.systemType == 'ios') {
    //             ajpush.setBadge({
    //                 badge: num
    //             });
    //         }
    //     },
    //     bindAliasAndTags: function () {
    //         var UserInfo = _g.getLS('UserInfo');
    //         var param = {
    //             alias: UserInfo.loginName,
    //             tags: ['all', 'app', api.systemType, '51SMT', UserInfo.type == 1 ? 'normal' : 'asker']
    //         };
    //         ajpush.bindAliasAndTags(param, function (ret) {
    //             var statusCode = ret.statusCode;
    //             if (ret.statusCode) {
    //                 _push.bindAliasAndTags();
    //             } else {
    //                 console.log('别名绑定成功');
    //             }
    //         });
    //     },
    // };


    (function () {
        // _push.init();
    })();

    (function () {
        window.reloadApp = function () {
            api.closeToWin({
                name: 'root',
                animation: { type: 'none' }
            });
            setTimeout(function () {
                // openLoginPage();
            }, 410)
        };
    })();


    // api.addEventListener({
    //     name: 'shake'
    // }, function(ret, err) {
    //     if (window.APPMODE == 'pub') return;
    //     api.alert({
    //         title: '当前代码版本为:',
    //         msg: window.VERSION,
    //     }, function(ret, err) {
    //
    //     });
    // });

    module.exports = {};

});

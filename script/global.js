/*
----------------------------------------------------
 */
window.APPMODE = 'pub'; // dev:开发模式, pub:发布模式
window.VERSION = '0.0.1'; // 代码版本号, 每次发布之前, 请更新, 小版本号自增+1
window.MOCKJS = false; // 是否打开mockjs, 正式版发布, 或者测试接口数据需要关闭
window.CONFIG = {}; // 全局配置
CONFIG.DEFAULT_AVATAR = '../../image/me/icon-logo.png'; // 默认头像
CONFIG.DEFAULT_PHOTO = '../../image/placeholder.png'; // 默认图片
APPMODE == 'dev' && (function() {
    CONFIG.HOST = 'http://a510api.wkuai.cc/api';
    CONFIG.HOST_PHOTO = 'http://a510api.wkuai.cc/';
    var isApp = !!window.localStorage.getItem('isApp');
    if (window.APPMODE == 'dev' && !isApp) {
        // 如果是开发模式并且不是app启动
        CONFIG.HOST = '';
    }
})();
APPMODE == 'pub' && (function() {
    // CONFIG.HOST = 'http://';
    // CONFIG.HOST = 'http://192.168.3.46/:5200/'; //蔡哲
    // CONFIG.HOST = 'http://192.168.1.3:5200/'; //建荣
    // CONFIG.HOST_PHOTO = 'http://192.168.3.46:5200/';
    CONFIG.HOST = 'http://8.129.223.18:5200/'; //线上
    // CONFIG.HOST = 'http://192.168.1.11:5200/' //测试
    // CONFIG.HOST = 'http://192.168.3.43:5200/' //胡超
    // CONFIG.HOST = 'http://192.168.1.15:5200/'; //刚刚
    //CONFIG.HOST = 'http://192.168.1.10:5200/'
    // CONFIG.HOST_PHOTO = 'http://8.129.223.18:5200/';
    // CONFIG.HOST_PHOTO = 'http://192.168.1.6:5200/';
    // CONFIG.SHARE_HOST = 'http://www.gzlingren.com:8098/app-51SMT/';

})();

apiready = function() {
    window.isReady = true;
    var resource = [
        'U/common',
        'L/vue/vue.base',
        'U/talkingDataSDK',
        $('#entry').data('path'),
    ];
    // if (api.systemType == 'ios') {
    //     window.APPMODE = 'dev';
    // } else {
    //     window.APPMODE = 'pub';
    // }
    var isApp = !!window.localStorage.getItem('isApp');
    if (typeof api == 'undefined' && !isApp) resource.splice(1, 0, 'U/xui');
    seajs.use(resource, function() {
        if (api.frameName) {
            api.execScript({
                name: api.winName,
                script: 'window.frameReady();'
            });
        }
        if (!window.leftBtnTap) {
            window.leftBtnTap = function() {
                api.closeWin();
            };
        }
        // _g.fixStatusBar();
        console.log('entry:' + (api.frameName || api.winName));
    });
};

// 兼容模拟器启动
$(function() {
    if (window.APPMODE == 'dev' && window.location.search.indexOf('isApp=1') > -1) {
        // 如果是开发模式并且是app启动
        window.localStorage.setItem('isApp', 1);
    }
    var isApp = !!window.localStorage.getItem('isApp');
    if ($('#entry').data('path') == 'app') isApp = true;
    window.APPMODE == 'dev' && !isApp && !window.isReady && apiready();
    window.APPMODE == 'pub' && window.location.host && !window.isReady && apiready();
    setTimeout(function() {
        !window.isReady && apiready();
    }, 2000);
});

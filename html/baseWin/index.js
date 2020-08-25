define(function (require, exports, module) {

    var isAppear = false;
    var opts = api.pageParam.opts || {};
    // frame加载完成
    window.frameReady = function () {
        if (window.isFrameReady) return;
        window.isFrameReady = true;
        $('.loader').remove();
    };
    // 左边按钮事件传递
    window.leftBtnTap = function () {
        if (window.isFrameReady) {
            api.execScript({
                name: opts.name + '-win',
                frameName: opts.name + '-frame',
                script: 'window.leftBtnTap();'
            });
        } else {
            api.closeWin();
        }
    };
    // 右边按钮事件传递
    window.rightBtnTap = function () {
        if (window.isFrameReady) {
            api.execScript({
                name: opts.name + '-win',
                frameName: opts.name + '-frame',
                script: 'window.rightBtnTap();'
            });
        }
    };
    // 扩展按钮事件传递
    window.extraBtnTap = function (params) {
        if (window.isFrameReady) {
            api.execScript({
                name: opts.name + '-win',
                frameName: opts.name + '-frame',
                script: 'window.extraBtnTap(' + JSON.stringify(params) + ');'
            });
        }
    };

    // 监听frame是否加载完成
    api.setFrameClient({
        frameName: opts.name + '-frame'
    }, function (ret, err) {
        // alert(ret.state);
        if (ret.state == 2) {
            window.frameReady();
        }
    });

    // 页面过渡动画完成
    _g.viewAppear(function () {
        isAppear = true;
        opts && _g.addContent(opts);
        if (api.winName == '') {

        }
    });
    // 检查450毫秒之后是否已经打开win
    setTimeout(function () {
        if (!isAppear) opts && _g.addContent(opts);
    }, 450);

    (function () {
        window.rightBtnChange = function (data) {
            if (data.rightBtnTrans) {
                (new Function(data.rightBtnTrans))();
            }
        };
        if (api.winName == 'website-win') {
            window.leftBtnTap = function () {
                api.closeWin();
            }
        }
        api.addEventListener({
            name: 'keyback'
        }, function (ret, err) {
            window.leftBtnTap();
        });
    })();

    module.exports = {};

});
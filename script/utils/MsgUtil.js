/**
 * Created by PromeYang on 17/7/20.
 */
define(function (require, exports, module) {
    var Http = require('U/http');
    // var Fleet = require('./html/fleet/fleet');

    var actions = {
        1000: function (extra) {
            //取消订单
            _g.openWin({
                header: {
                    title: '问题详情'
                },
                name: 'quickAsk-askDetail',
                url: '../quickAsk/askDetail_frame.html',
                bounces: true,
                slidBackEnabled: false,
                pageParam:{
                    id: extra.thirdId
                }
            });
        },
        1001: function (extra) {
            //接单
            _g.openWin({
                header: {
                    title: '问题详情'
                },
                name: 'quickAsk-askDetail',
                url: '../quickAsk/askDetail_frame.html',
                bounces: true,
                slidBackEnabled: false,
                pageParam:{
                    id: extra.thirdId
                }
            });
        },
        1002: function (extra) {
            //评价
            _g.openWin({
                header: {
                    title: '问题详情'
                },
                name: 'quickAsk-askDetail',
                url: '../quickAsk/askDetail_frame.html',
                bounces: true,
                slidBackEnabled: false,
                pageParam:{
                    id: extra.thirdId
                }
            });
        },
        1003: function (extra) {
            //消息推送
            _g.openWin({
                header: {
                    title: '详情'
                },
                name: 'message-detail',
                url: '../message/detail_frame.html',
                bounces: true,
                slidBackEnabled: false,
                pageParam:{
                    id: extra.thirdId
                }
            });
        },
    };

    var MsgUtil = {
        action: function (extra) {
            var extraId = null;
            actions[extra.type] && actions[extra.type](extra);
        }
    };

    module.exports = MsgUtil;

});


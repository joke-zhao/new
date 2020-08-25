define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('message/weChat_view'),

        data() {
            return {
                path: "ws://8.129.223.18:5200/webSocket/CHAT" + api.pageParam.msgId,
                socket: "",

                userId: "",
                msgList: [],//读取聊天  列表
                msg: "",//聊天输入框
                sendUserId: api.pageParam.sendUserId,//发送消息用户的id   右侧
                receiveUserId: api.pageParam.receiveUserId,//接收消息用户的id   左侧   ---当前用户id
            }
        },
        created() {
            this.userId = _g.getLS('userId')
            this.selectChatRecord();//读取聊天接口
            this.init();
        },
        updated() {
            // 聊天定位到底部
            window.scrollTo(0, 50000);
        },
        methods: {
            init: function () {
                if (typeof (WebSocket) === "undefined") {
                    alert("您的浏览器不支持socket")
                } else {
                    // 实例化socket
                    this.socket = new WebSocket(this.path)
                    // 监听socket连接
                    this.socket.onopen = this.open
                    // 监听socket错误信息
                    this.socket.onerror = this.error
                    // 监听socket消息
                    this.socket.onmessage = this.getMessage
                }
            },
            open: function () {
                console.log("socket连接成功")
            },
            error: function () {
                console.log("连接错误")
            },
            getMessage: function (msg) {
                console.log(msg.data)
                this.selectChatRecord()
            },
            send: function () {
                this.socket.send(params)
            },
            close: function () {
                console.log("socket已经关闭")
            },
            // go底部
            toBottom() {
                // 滚动内容的坐标位置0,50000：
                window.scrollTo(0, 50000);
            },
            // 查询聊天记录
            selectChatRecord() {
                var url = "api/control/beatChat/selectChatRecord";
                var option = {
                    data: {
                        recipientId: this.receiveUserId,//接收方userID
                        senderId: this.sendUserId,//发送方userid
                        // recipientId:'2c9080817370984c017370a1150b0002',
                        // senderId:'2c9080817370984c017370a1eb5e0005'
                    },
                }
                Http.ajax({
                    data: option,
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.msgList = ret.data.list;
                            window.scrollTo(0, 50000);
                        }
                    },
                });
            },
            // 发送消息
            sendChat() {
                if(this.msg){
                    var url = "api/control/beatChat/sendChat";
                    var option = {
                        data: {
                            content: this.msg,
                            recipientId: this.receiveUserId,//接收方userID
                            senderId: this.sendUserId,//发送方userid
                            senderName: _g.getLS("nickName"),
                            senderPhoto: _g.getLS("photoUrl")
                        },
                    }
                    Http.ajax({
                        data: option,
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: false,
                        lock: true,
                        url: url,
                        success: function (ret) {
                            if (ret.code === 200) {
                                main.selectChatRecord();
                                main.msg = ""
                            }
                        },
                    });
                }else{

                }
            },
        },
        destroyed() {
            // 销毁监听
            this.socket.onclose = this.close
        },
        filters: {
            formatDate(date) {
                if (!date) {
                    return '暂无时间';
                } else {
                    var time = new Date(date).Format("yyyyMMdd");//数据时间
                    var week = new Date(date).getDay();
                    var getTime = new Date().Format("yyyyMMdd")//当前时间
                    var weekTime = new Date().getDay();
                    var weeks = ["日", "一", "二", "三", "四", "五", "六"];
                    var getWeek = "星期" + weeks[week];
                    // var time2 = new Date(date).getTime();
                    // var getTime2 = new Date().getTime();
                    if (time === getTime) {
                        time = new Date(date).Format("hh:mm");//今天
                    } else if (getTime - time === 1) {
                        time = '昨天' + new Date(date).Format("hh:mm");//昨天
                    } else if (getTime - time === 2) {
                        time = '前天' + new Date(date).Format("hh:mm");//前天
                    } else if (week + weekTime <= 7 && getTime - time <= 7) {//getTime2 - time2 <= 604800000//604800秒=7天= 604800000 毫秒
                        time = getWeek + new Date(date).Format("hh:mm");//星期几
                    }else {
                        time = new Date(date).Format("yyyy年MM月dd日 hh:mm");
                    }
                    return time
                }
            },
        },
    });


    (function () {

    })();
    module.exports = {};
});

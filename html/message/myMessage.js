define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('message/myMessage_view'),
        data: {
            messageList: [],
            // webSocket
            path: "ws://8.129.223.18:5200/webSocket/CHAT" + _g.getLS('userId'),
            socket: "",
            isCharShow: true,
            isNoticeShow: false,
            noticeList:[
                {
                    imgUrl: '../../image/login/logo1.png',
                    nickname: '单据核对',
                    content: '拍照上传、审核单据、自制单据的确认、单据准备'

                },
                {
                    imgUrl: '../../image/login/logo1.png',
                    nickname: '取单通知',
                    content: '接收代账人员发来的取单通知'

                },
                {
                    imgUrl: '../../image/login/logo1.png',
                    nickname: '报表确认',
                    content: '税金确认、纳税申报确认、会计报表确认'

                },
                {
                    imgUrl: '../../image/login/logo1.png',
                    nickname: '款项通知',
                    content: '预存税款提醒、欠款催收'

                },
                {
                    imgUrl: '../../image/login/logo1.png',
                    nickname: '财税分析',
                    content: '报表分析、风险提示、改进意见'

                }
            ]
        },
        created: function () {
            this.getCharList();
            this.init();
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
                var data = _g.s2j(msg.data)
                console.log(data)
                this.getCharList();
                //弹出状态栏通知
                api.notification({
                    notify: {
                        title: data.nickname,
                        content: data.content
                    }
                });
            },
            send: function () {
                this.socket.send(params)
            },
            close: function () {
                console.log("socket已经关闭")
            },
            //查询聊天列表
            getCharList() {
                var url = "api/control/beatChat/selectChatList";
                var option = {
                    data: {
                        userId: _g.getLS("userId")
                    },
                    limit: 10,
                    page: 1,
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
                            main.messageList = ret.data.list;
                        }
                    },
                });
            },
            //打开聊天框
            openWechat(item) {
                //读取聊天记录
                var url = "api/control/beatChat/chatRead";
                var option = {
                    data: {
                        recipientId: item.userOne,//接收方userID
                        senderId: item.userTwo,//发送方userid
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
                        //!此处不需要 code=200 也可跳转    无论读取成功或失败都打开聊天框
                        _g.openWin({
                            header: {
                                title: item.nickname
                            },
                            name: "weChat-message",
                            url: "../message/weChat_frame.html",
                            bounces: false,
                            slidBackEnabled: false,
                            bgColor: '#fff',
                            pageParam: {
                                sendUserId: item.userTwo,//发送消息用户的id   右侧
                                receiveUserId: item.userOne,//接收消息用户的id   左侧
                                msgId: item.id,//消息id
                            } //携参
                        })
                    },
                });
            },


            //切换
            switchChar(){
              this.isCharShow = true;
              this.isNoticeShow = false;
            },
            switchNotice(){
                this.isCharShow = false;
                this.isNoticeShow = true;
            },
            // 通知开始
            //打开通知
            openNotice(index) {
                console.log(index+1)
                _g.openWin({
                    header: {},
                    name: "notice",
                    url: "../message/unilateralCheck_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        type: index+1
                    } //携参
                })
            },



            // 通知结束

        },
        filters: {

            // date为时间戳
            formatDate(date) {
                if (!date) {
                    return '';
                } else {
                    var a = new Date(date).Format("hh:mm")
                    return a
                }
            },

        },
    });

    // 下拉刷新
    _g.setPullDownRefresh(function () {
        main.getCharList()
    });
    (function () {

    })();
    module.exports = {};
});

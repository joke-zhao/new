define(function (require, exports, module) {
    var rong = api.require('rongCloud2');

    function VideoCall() {
        this.myUserId = ''; // 我的id
        this.callId = ''; // 通话id
        this.isMuted = false; // 是否静音
        this.speakerEnabled = false; // 是否打开扬声器
        this.profile = '720p';
        this.timer = ''; // 震动定时器
    }

    VideoCall.prototype = {
        // 初始化融云
        init: function () {
            // if (!_g.checkUser({type: 1})) {
            //     return;
            // }
            var self = this;
            self.removeListener();
            rong.init(function (ret, err) {
                if (ret.status == 'error') {
                    _g.toast('初始化失败！');
                }
            });
            // 设置连接状态变化的监听器
            rong.setConnectionStatusListener(function (ret, err) {
                console.log('连接状态：' + ret.result.connectionStatus);
                if (ret.result.connectionStatus == 'KICKED') {
                    _g.toast('出现错误，请重新打开app');
                }
            });

            rong.addCallReceiveListener({
                target: 'didReceiveCall'
            }, function (ret) {
                // 弹出通知，点击跳到视频窗口
                // self.timer = setInterval(function () {
                //     api.notification({
                //         vibrate:[500, 500]
                //     });
                // }, 1000)
                self.callId = ret.callSession.targetId;
                self.openVideoView(ret.callSession, 'accept');
            });

            this.callListener();

            // 连接
            // _g.getLS('token'); // 应由服务器生成返回
            rong.connect({
                token: 'nyTfGCoki346IB9QFWJ8aHqWEtDIPDTQEtiX1IBMAhggn42gBSUncAPZPzGe8Eea+RGCm2qZRqD96j+5TDzz6A=='
                // token: 'GT5Ky5rjkKQ44fFg0oJL3u4CtZLc9FK63welmQjOV9ketQxbrMA7dqIN+jH70LayUCnivN9St4MRJv6IR7n6lA=='
            }, function (ret, err) {
                if (ret) {
                    if (ret.status == 'success') {
                        console.log('用户登录id：' + ret.result.userId);
                    } else {
                        _g.toast(err.code);
                    }
                }
            });
        },
        openVideoView: function (opt, type) {
            _g.openWin({
                name: 'openDoor-videoView',
                url: '../openDoor/videoView_frame.html',
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                slidBackEnabled: false,
                bounces: false,
                pageParam: {
                    type: type, // 判断是打电话的还是接电话的
                    info: opt
                }
            });
        },
        // 设置视频区域
        setVideoView: function (opt, type) {
            var self = this;
            opt = opt || {};

            rong.setVideoView({
                rect: {
                    x: 0,
                    y: 0,
                    w: api.frameWidth,
                    h: api.frameHeight
                },
                userId: opt.targetId,
                bg: '#000',
                fixedOn: api.frameName,
            });

            rong.setVideoProfile({
                profile: self.profile
            });

            var tool = _g.frameBuilder({
                name: 'openDoor-videoTool',
                url: '../openDoor/videoTool_frame.html',
                rect: {
                    x: 0,
                    y: api.winHeight - api.winWidth * 230 / 750,
                    w: 'auto',
                    h: api.winWidth * 230 / 750
                },
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                slidBackEnabled: true,
                isOpen: false,
                pageParam: {
                    type: type // 判断是打电话的还是接电话的
                }
            }, 'normal');
            tool.show();
        },
        startCall: function (opt) {
            // 判断是否登录和是否连接成功
            // if (!_g.checkUser({type: 1})) {
            //     return;
            // }
            var self = this;
            opt = opt || {};
            self.callId = opt.targetId;

            rong.startCall({
                targetId: opt.targetId || '',
                mediaType: 'video',
                conversationType: opt.conversationType || 'PRIVATE',
                userIdList: opt.userList || [], // 视频对象id
                extra: opt.extra || '' // 附加信息
            }, function (ret) {
                self.openVideoView(ret.callSession, 'call');
            });

        },
        acceptCall: function () {
            var self = this;
            rong.getCallSession(function (ret) {
                self.callId = ret.targetId;
                rong.accept({
                    mediaType: 'video',
                    callId: self.callId
                });
            });

            // 接听后隐藏接听键
            _g.execScript({
                winName: 'openDoor-videoView-win',
                frameName: 'openDoor-videoTool',
                fnName: 'accepted',
                data: {
                    type: 'accepted'
                }
            })
        },
        endCall: function () {
            _g.toast('通话结束');
            var self = this;
            rong.hangup();

            if (api.systemType == "ios") {
                rong.setCameraEnabled({
                    cameraEnabled: false
                }, function (ret) {
                    console.log('摄像头关闭成功');
                });

                // 移除视频区域
                rong.removeVideoView({
                    userId: self.callId
                });

                api.closeFrame({
                    name: 'openDoor-videoTool'
                });
                api.closeWin({
                    name: 'openDoor-videoView-win'
                });
            }
        },
        callListener: function () {
            // 通话事件监听
            // opt = opt || {};
            var self = this;
            // 监听接听状态
            rong.addCallSessionListener({
                target: 'didConnect'
            }, function (ret) {
                // clearInterval(self.timer);
                rong.setCameraEnabled({
                    cameraEnabled: true
                }, function (ret) {
                    console.log('摄像头打开成功');
                });
            });

            // 监听通话结束状态
            rong.addCallSessionListener({
                target: 'didDisconnect'
            }, function (ret) {
                // 关闭按钮frame和视频区域win
                rong.getCallSession(function (ret) {
                    self.callId = ret.targetId;
                    rong.setCameraEnabled({
                        cameraEnabled: false
                    }, function (ret) {
                        console.log('摄像头关闭成功');
                    });

                    // 移除视频区域
                    rong.removeVideoView({
                        userId: self.callId
                    });

                    api.closeFrame({
                        name: 'openDoor-videoTool'
                    });
                    api.closeWin({
                        name: 'openDoor-videoView-win'
                    });
                });
            });
        },
        changeMedio: function (type) {
            var self = this;
            var flag = false;
            switch (type) {
                case 'muted' :
                    rong.setMuted({
                        muted: !self.isMuted
                    }, function (ret) {
                    });
                    self.isMuted = !self.isMuted
                    flag = self.isMuted;
                    break;
                case 'speaker' :
                    rong.setSpeakerEnabled({
                        speakerEnabled: !self.speakerEnabled
                    }, function (ret) {
                    });
                    self.speakerEnabled = !self.speakerEnabled;
                    flag = self.speakerEnabled;
                    break;
                case 'camera' :
                    // rong.switchCameraMode(function (ret) {
                    //     self.speakerEnabled = !self.speakerEnabled;
                    //     flag = self.speakerEnabled;
                    // });
                    break;
            }

            _g.execScript({
                winName: 'openDoor-videoView-win',
                frameName: 'openDoor-videoTool',
                fnName: 'changeMedio',
                data: {
                    type: type,
                    value: flag
                }
            });
        },
        removeListener: function () {
            // 移除通话事件监听
            rong.removeCallSessionListener({
                target: 'didConnect'
            });
            rong.removeCallSessionListener({
                target: 'didDisconnect'
            });

            // 退出app的时候
            rong.removeCallReceiveListener({
                target: 'didReceiveCall'
            }, function () {
                console.log('移除来电监听');
            });
            // 断开连接
            rong.disconnect({
                isReceivePush: true
            }, function (ret, err) {
                if ('success' == ret.status) {
                    api.toast({msg: '断开连接成功!'});
                }
            });
        }
    };
    module.exports = new VideoCall();
});
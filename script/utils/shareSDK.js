define(function(require, exports, module) {

    var wx = api.require('wx');
    // var weibo = api.require('weibo');
    var qq = api.require('QQPlus');
    // var dialogBox = api.require('dialogBox');
    var options;

    function ShareSDK() {
        this._opts = {
            title: '学股票上学股网',
            description: '学股网现设主要板块有课堂(财经视频教育)、悬赏问答(财经知识)、在线课程直播等优质内容，旨在为用户普及投资理财知识，提高用户投资理财技能，提升全民互联网金融素质。公司现有办公面积2000平方，工作人员196人，下设运营中心和研发中心，全力打造完善可靠的在线金融教育平台，为用户提供优质服务。',
            contentUrl: 'http://www.xueguwang.cn'
        };
    }

    var shareFrame = _g.frameBuilder({
        isOpen: false,
        name: 'common-share-frame',
        url: '../common/share_frame.html',
        bounces: false,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false,
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        },
        pageParam: {
            frameName: api.frameName || ''
        }
    });

    shareFrame.open();
    (function() {
        window.hideShare = function() {
            shareFrame.hide();
        };
        window.shareTap = function(data) {
            var tag = data.tag || '';
            // alert(_g.j2s(options))
            var action = {
                session: function() {
                    var opts = options;
                    var type = opts.type;
                    delete opts.type;
                    wx.isInstalled(function(ret, err) {
                        if (ret.installed) {
                            wx.shareWebpage({
                                scene: 'session',
                                title: opts.title,
                                description: opts.description,
                                thumb: (api.systemType === 'ios' ? opts.thumb : opts.androidThumb) || 'widget://image/common/icon-share-logo.png',
                                contentUrl: opts.contentUrl
                            }, function(ret, err) {
                                if (ret.status) {
                                    // dialogBox.close({
                                    //     dialogName: 'actionMenu'
                                    // });
                                    shareFrame.hide();
                                    // api.alert({
                                    //     title: '提示',
                                    //     msg: '分享成功',
                                    // }, function(ret, err) {

                                    // });
                                } else {
                                    alert('分享失败');
                                }
                            });
                        } else {
                            api.alert({ msg: "当前设备未安装微信客户端" });
                        }
                    });
                },
                timeline: function() {
                    var opts = options;
                    var type = opts.type;
                    delete opts.type;
                    wx.isInstalled(function(ret, err) {
                        if (ret.installed) {
                            wx.shareWebpage({
                                scene: 'timeline',
                                title: opts.title,
                                description: opts.description,
                                thumb: (api.systemType === 'ios' ? opts.thumb : opts.androidThumb) || 'widget://image/common/placeholder.png',
                                contentUrl: opts.contentUrl
                            }, function(ret, err) {
                                if (ret.status) {
                                    // dialogBox.close({
                                    //     dialogName: 'actionMenu'
                                    // });
                                    shareFrame.hide();
                                    // api.alert({
                                    //     title: '提示',
                                    //     msg: '分享成功',
                                    // }, function(ret, err) {

                                    // });
                                } else {
                                    // shareFrame.hide();
                                    alert('分享失败');
                                }
                            });
                        } else {
                            api.alert({ msg: "当前设备未安装微信客户端" });
                        }
                    });
                },
                qq: function() {
                    var opts = options;
                    var type = opts.type;
                    delete opts.type;
                    qq.installed(function(ret, err) {
                        if (ret.status) {
                            qq.shareNews({
                                url: opts.url,
                                title: opts.title,
                                description: opts.description,
                                imgUrl: (api.systemType === 'ios' ? opts.thumb : opts.androidThumb) || 'widget://image/common/placeholder.png',
                                type: 'QFriend'
                            }, function(ret, err) {
                                if (ret.status) {
                                    shareFrame.hide();
                                    // api.alert({
                                    //     title: '提示',
                                    //     msg: '分享成功',
                                    // }, function(ret, err) {

                                    // });
                                } else {
                                    // _g.alert(ret,err)
                                }
                            });
                        } else {
                            api.alert({ msg: "未安装QQ客户端" });
                        }
                    });
                }
            };
            action[tag] && action[tag]();
        };
    })();

    ShareSDK.prototype = {
        init: function(opts) {
            this._opts = $.extend(true, this._opts, opts);
        },
        session: function() {
            var opts = options;
            var type = opts.type;
            delete opts.type;
            wx.isInstalled(function(ret, err) {
                if (ret.installed) {
                    wx.shareWebpage({
                        scene: 'session',
                        title: opts.title,
                        description: opts.description,
                        thumb: (api.systemType === 'ios' ? opts.thumb : opts.androidThumb) || 'widget://image/common/icon-share-logo.png',
                        contentUrl: opts.contentUrl
                    }, function(ret, err) {
                        if (ret.status) {
                            // dialogBox.close({
                            //     dialogName: 'actionMenu'
                            // });
                            shareFrame.hide();
                            var action = {
                                cut: function() {
                                    _g.execScript({
                                        winName: 'share-list-win',
                                        frameName: 'share-list-frame',
                                        fnName: 'shareSuc'
                                    });
                                }
                            };
                            action[type] && action[type]();
                            api.alert({
                                title: '提示',
                                msg: '分享成功',
                            }, function(ret, err) {

                            });
                        } else {
                            alert('分享失败');
                        }
                    });
                } else {
                    api.alert({ msg: "当前设备未安装微信客户端" });
                }
            });
        },
        timeline: function() {
            var opts = options;
            var type = opts.type;
            delete opts.type;
            wx.isInstalled(function(ret, err) {
                if (ret.installed) {
                    wx.shareWebpage({
                        scene: 'timeline',
                        title: opts.title,
                        description: opts.description,
                        thumb: (api.systemType === 'ios' ? opts.thumb : opts.androidThumb) || 'widget://image/common/icon-share-logo.png',
                        contentUrl: opts.contentUrl
                    }, function(ret, err) {
                        if (ret.status) {
                            // dialogBox.close({
                            //     dialogName: 'actionMenu'
                            // });
                            shareFrame.hide();
                            var action = {
                                cut: function() {
                                    _g.execScript({
                                        winName: 'share-list-win',
                                        frameName: 'share-list-frame',
                                        fnName: 'shareSuc'
                                    });
                                }
                            };
                            action[type] && action[type]();
                            shareFrame.hide();
                            api.alert({
                                title: '提示',
                                msg: '分享成功',
                            }, function(ret, err) {

                            });
                        } else {
                            // shareFrame.hide();
                            alert('分享失败');
                        }
                    });
                } else {
                    api.alert({ msg: "当前设备未安装微信客户端" });
                }
            });
            // ShareSDK.wx.share('timeline', options);
        },
        weibo: {
            login: function() {

            },
            share: function(opts) {
                weibo.isInstalled(function(ret) {
                    if (ret.status) {
                        weibo.shareWebPage({
                            text: '学股网现设主要板块有课堂(财经视频教育)、悬赏问答(财经知识)、在线课程直播等优质内容，旨在为用户普及投资理财知识，提高用户投资理财技能，提升全民互联网金融素质。公司现有办公面积2000平方，工作人员196人，下设运营中心和研发中心，全力打造完善可靠的在线金融教育平台，为用户提供优质服务。',
                            title: opts.title, //'学股票上学股网',
                            description: opts.description, //'学股网现设主要板块有课堂(财经视频教育)、悬赏问答(财经知识)、在线课程直播等优质内容，旨在为用户普及投资理财知识，提高用户投资理财技能，提升全民互联网金融素质。公司现有办公面积2000平方，工作人员196人，下设运营中心和研发中心，全力打造完善可靠的在线金融教育平台，为用户提供优质服务。',
                            thumb: 'widget://image/common/icon-share-logo.png',
                            contentUrl: opts.url, //'http://www.xueguwang.cn'
                        }, function(ret, err) {
                            if (ret.status) {
                                dialogBox.close({
                                    dialogName: 'actionMenu'
                                });
                                api.alert({
                                    title: '提示',
                                    msg: '分享成功',
                                }, function(ret, err) {

                                });
                            } else {
                                // alert(err.code);
                            }
                        });
                    } else {
                        api.alert({ msg: "未安装新浪微博客户端" });
                    }
                });
            }
        },
        qq: {
            login: function() {

            },
            share: function(opts) {
                qq.installed(function(ret, err) {
                    if (ret.status) {
                        qq.shareNews({
                            url: opts.url,
                            title: opts.title,
                            description: opts.description,
                            imgUrl: opts.thumb,
                            type: 'QFriend'
                        }, function(ret, err) {
                            if (ret.status) {
                                dialogBox.close({
                                    dialogName: 'actionMenu'
                                });
                                api.alert({
                                    title: '提示',
                                    msg: '分享成功',
                                }, function(ret, err) {

                                });
                            } else {
                                // alert(err.code);
                            }
                        });
                    } else {
                        api.alert({ msg: "未安装QQ客户端" });
                    }
                });
            }
        },
        openShare: function(opts) {
            var self = this;
            shareFrame.show();
            api.bringFrameToFront({
                from: 'common-share-frame'
            });
            options = opts;
            return
            dialogBox.actionMenu({
                rect: {
                    h: 150
                },
                texts: {
                    cancel: '取消'
                },
                items: [{
                    text: '微信好友',
                    icon: 'widget://image/common/icon-share-weixin.jpg'
                }, {
                    text: '朋友圈',
                    icon: 'widget://image/common/icon-share-weixin2.jpg'
                }, {
                    text: '新浪微博',
                    icon: 'widget://image/common/icon-share-weibo.jpg'
                }, {
                    text: 'QQ好友',
                    icon: 'widget://image/common/icon-share-qq.jpg'
                }],
                styles: {
                    bg: '#FFF',
                    column: 4,
                    itemText: {
                        color: '#000',
                        size: 12,
                        marginT: 8
                    },
                    itemIcon: {
                        size: 43
                    },
                    cancel: {
                        bg: 'fs://icon.png',
                        color: '#000',
                        h: 44,
                        size: 14
                    }
                },
                tapClose: true,
            }, function(ret) {
                if (ret.eventType == 'cancel') {
                    dialogBox.close({
                        dialogName: 'actionMenu'
                    });
                } else {
                    switch (ret.index) {
                        case 0:
                            self.wx.share('session', opts);
                            break;
                        case 1:
                            self.wx.share('timeline', opts);
                            break;
                        case 2:
                            self.weibo.share(opts);
                            break;
                        case 3:
                            self.qq.share(opts);
                            break;
                    }
                }
            });
        },
    };

    ShareSDK.prototype.constructor = ShareSDK;

    module.exports = new ShareSDK();

});
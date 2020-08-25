(function () {

    // 常用函数库

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") // ==> 2016-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      // ==> 2016-7-2 8:9:4.18

    function Common() {
        this.isAndroid = (/android/gi).test(navigator.appVersion);
        this.isIOS = (/mac/gi).test(navigator.appVersion);
    }

    Common.prototype = {
        showPageInfo: function () {
            var pageInfo = {
                winName: api.winName,
                frameName: api.frameName,
                screenWidth: api.screenWidth,
                screenHeight: api.screenHeight,
                winWidth: api.winWidth,
                winHeight: api.winHeight,
                frameWidth: api.frameWidth,
                frameHeight: api.frameHeight,
                appVersion: api.appVersion
            };
            var info = '';
            _.each(pageInfo, function (value, key) {
                info += key + ':' + value + '\r\n';
            });
            this.alert(info);
        },
        uzStorage: function () {
            var ls = window.localStorage;
            if (this.isAndroid && !window.location.host) ls = os.localStorage();
            return ls;
        },
        setLS: function (key, value) {
            if (arguments.length === 2) {
                var v = value;
                if (typeof v == 'object') {
                    v = JSON.stringify(v);
                    v = 'obj-' + v;
                } else {
                    v = 'str-' + v;
                }
                var ls = this.uzStorage();
                if (ls) {
                    ls.setItem(key, v);
                }
            }
        },
        getLS: function (key) {
            var ls = this.uzStorage();
            if (ls) {
                var v = ls.getItem(key);
                if (!v) {
                    return;
                }
                if (v.indexOf('obj-') === 0) {
                    v = v.slice(4);
                    return JSON.parse(v);
                } else if (v.indexOf('str-') === 0) {
                    return v.slice(4);
                }
            }
        },
        rmLS: function (key) {
            var ls = this.uzStorage();
            if (ls && key) ls.removeItem(key);
        },
        clearLS: function () {
            var ls = this.uzStorage();
            if (ls) ls.clear();
        },
        getStatusBarHeight: function () {
            var StatusBarHeight = 0;
            if (api.systemType === 'ios') {
                var strSV = api.systemVersion;
                var numSV = parseInt(strSV, 10);
                var fullScreen = api.fullScreen;
                var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
                if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                    StatusBarHeight = 20;
                }
            } else if (api.systemType === 'android') {
                var ver = api.systemVersion;
                ver = parseFloat(ver);
                if (ver >= 4.4) {
                    StatusBarHeight = 25;
                }
            }
            if (api.safeArea) return api.safeArea.top;
            return StatusBarHeight;
        },
        fixStatusBar: function () {
            var header = $('#header')[0];
            if (!api) return;
            if (!header) return;
            if (api.systemType == 'ios') {
                var strSV = api.systemVersion;
                var numSV = parseInt(strSV, 10);
                var fullScreen = api.fullScreen;
                var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
                if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                    header.style.paddingTop = '20px';
                }
            } else if (api.systemType == 'android') {
                var ver = api.systemVersion;
                ver = parseFloat(ver);
                if (ver >= 4.4) {
                    header.style.paddingTop = '25px';
                }
            }
        },
        isElement: function (obj) {
            return !!(obj && obj.nodeType == 1);
        },
        isArray: function (obj) {
            if (Array.isArray) {
                return Array.isArray(obj);
            } else {
                return obj instanceof Array;
            }
        },
        isEmptyObject: function (obj) {
            if (JSON.stringify(obj) === '{}') {
                return true;
            }
            return false;
        },
        toast: function (msg, duration, location, global) {
            if (typeof duration == 'string') location = duration;
            // var bottom = {
            // 	top: window.innerHeight * 0.8,
            // 	middle: window.innerHeight * 0.5,
            // 	bottom: window.innerHeight * 0.1
            // };

            // new Toast({
            // 	msg: msg || '',
            // 	bottom: bottom[location || 'middle'],
            // 	// img:'http://art.yypm.com/300x150',
            // 	skin: 'is-adbingo',
            // 	duration: duration ? duration + 'ms' : '1s'
            // });

            api && api.toast({
                msg: msg || '',
                duration: duration || 2000,
                location: location || 'middle',
                global: global || false
            });
        },
        addHeader: function (opts) {
            var header = new Vue({
                el: opts.el || '#header',
                template: _g.getTemplate(opts.template || 'common/header-base-V'),
                data: opts.data || {},
                methods: (function () {
                    return $.extend(true, {
                        onTapLeftBtn: function () {
                            if (this.frameName) {
                                api.sendEvent({
                                    name: api.winName + '-closeFrame'
                                })
                                return
                            }
                            api && api.closeWin();
                        }
                    }, opts.methods);
                })(),
                ready: function () {
                    setTimeout(function () {
                        $('body')[0].style.paddingTop = $('#header').height() + 'px';
                    }, 0);
                }
            });
            return header;
        },
        addContent: function (opts) {
            if (!opts.name) return;
            if (!opts.url) return;
            var headerHeight = $('#header').height();
            setTimeout(function () {
                api && api.openFrame({
                    name: opts.name + '-frame',
                    url: opts.url,
                    bounces: opts.bounces !== false,
                    vScrollBarEnabled: api.systemType != 'android',
                    hScrollBarEnabled: api.systemType != 'android',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: api.winHeight - headerHeight
                    },
                    pageParam: opts.pageParam || {}
                });
            }, 0);
            setTimeout(function () {
                api.setFrameAttr({
                    name: opts.name + '-frame',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: api.winHeight - headerHeight
                    },
                });
            }, 500);
        },
        openWin: function (opts, normal) {
            // var td = api.require('talkingData');
            // seajs.use('./talkingDataSDK');
            var opts = _.extend({}, opts);
            var title = getTitle({ winName: opts.name + '-win' });
            console.log('_g.openWin:' + title);
            var startTime = new Date().getTime();
            _g.setLS('LastTime', startTime);
            if (!opts.name) return;
            if (!opts.url) return;
            // var pageHistory = _g.getLS('pageHistory') || [];

            // pageHistory.push({
            //     winName: opts.name + '-win',
            //     frameName: !normal ? opts.name + '-frame' : ''
            // });
            // _g.setLS('pageHistory', pageHistory);
            // if (api.systemType === 'ios') {
            //     api.setStatusBarStyle({
            //         style: 'dark'
            //     });
            // }
            if (normal) {
                var headerOpts = '?StatusBarHeight=' + _g.getLS('StatusBarHeight');
                if (_.isObject(opts.header)) {
                    _.each(opts.header, function (value, key) {
                        headerOpts += '&' + key + '=' + value;
                    });
                }
                opts.name += '-win';
                opts.url += headerOpts;
                if (api.systemType === 'android') opts.hScrollBarEnabled = false;
                api.openWin(opts);
            } else {
                // 页面头部设置, 所有属性可选
                // opts.header = {
                //     title: '标题',
                //     leftIcon: '',
                //     leftText: '返回',
                //     rightIcon: '',
                //     rightText: '更多'
                // };
                var headerOpts = '?StatusBarHeight=' + _g.getLS('StatusBarHeight');
                if (_.isObject(opts.header)) {
                    _.each(opts.header, function (value, key) {
                        headerOpts += '&' + key + '=' + value;
                    });
                }
                if (opts.customHeader) {
                    _g.setLS('customHeader', opts.customHeader);
                }
                api.openWin({
                    name: opts.name + '-win',
                    url: (function () {
                        if (api.winName === 'root' || api.winName === 'dev-win') return './html/baseWin/index.html' + headerOpts;
                        return '../baseWin/index.html' + headerOpts;
                    })(),
                    bounces: opts.bounces || false,
                    slidBackEnabled: !!opts.slidBackEnabled,
                    vScrollBarEnabled: api.systemType !== 'android',
                    hScrollBarEnabled: api.systemType !== 'android',
                    pageParam: { opts: opts }
                });
            }
        },
        frameBuilder: function (opts) {
            if (!opts || !opts.name) return null;
            var Frame = {
                name: opts.name,
                opts: opts,
                isOpen: _.has(opts, 'isOpen') ? opts.isOpen : true,
                open: function () {
                    if (this.isOpen) {
                        api.openFrame(opts);
                    }
                },
                show: function () {
                    if (this.isOpen) {
                        api.setFrameAttr({
                            name: this.name,
                            hidden: false
                        });
                    } else {
                        this.isOpen = true;
                        this.open(this.opts);
                    }
                },
                hide: function () {
                    api.setFrameAttr({
                        name: this.name,
                        hidden: true
                    });
                }
            };
            return Frame;
        },
        // 设置baseWin页面头部
        setHeader: function (opts) {
            api.execScript({
                name: api.winName,
                script: 'window.setHeader(' + JSON.stringify(opts) + ');'
            });
        },
        closeWins: function (winNames) {
            _.each(winNames, function (winName) {
                api.closeWin({
                    name: winName,
                    animation: { type: "none" }
                });
            });
        },
        showProgress: function (opts) {
            // if (window.isApp) {
            //     var UILoading = api.require('UILoading');
            //     UILoading.keyFrame({
            //         rect: {
            //             w: 80,
            //             h: 80
            //         },
            //         styles: {
            //             // bg: 'rgba(0,0,0,0.5)',
            //             bg: 'rgba(255,255,255,0)',
            //             corner: 5,
            //             interval: 50,
            //             frame: {
            //                 w: 80,
            //                 h: 80
            //             }
            //         },
            //         content: (function () {
            //             var list = [];
            //             for (var i = 1; i <= 12; i++) {
            //                 list.push({
            //                     frame: 'widget://image/common/loading/' + i + '.png'
            //                 })
            //             }
            //             return list
            //         })(),
            //         mask: 'rgba(0,0,0,0)'
            //     });
            // } else {
            opts = $.extend(true, {
                style: 'default',
                animationType: 'fade',
                modal: true
            }, opts);
            api && api.showProgress(opts);
            // }
        },
        hideProgress: function () {
            // if (window.isApp) {
            //     var UILoading = api.require('UILoading');
            //     UILoading.closeKeyFrame();
            // } else {
            api && api.hideProgress();
            // }
        },
        viewAppear: function (callback) {
            api && api.addEventListener({
                name: 'viewappear'
            }, function (ret, err) {
                callback && callback();
            });
        },
        setFile: function (opts, callback) {
            var ret, fs = api.require('fs');
            var fd = null;
            opts.path = 'fs://data/' + opts.path;
            ret = fs.existSync({
                path: opts.path
            });
            if (!ret.exist) {
                ret = fs.createFileSync({
                    path: opts.path
                });
            }
            ret = fs.openSync({
                path: opts.path,
                flags: 'read_write'
            });
            if (ret.status) {
                fd = ret.fd
                ret = fs.writeSync({
                    fd: fd,
                    data: JSON.stringify(opts.content),
                    offset: 0,
                    overwrite: true
                });
                if (ret.status) {
                    ret = fs.closeSync({
                        fd: fd
                    });
                    if (ret.status) {
                        callback && callback(ret);
                    } else {
                        alert(JSON.stringify(ret));
                    }
                } else {
                    alert(JSON.stringify(ret));
                }
            } else {
                alert(JSON.stringify(ret));
            }
        },
        getFile: function (opts) {
            var ret, fs = api.require('fs');
            var fd = null;
            opts.path = 'fs://data/' + opts.path;
            ret = fs.existSync({
                path: opts.path
            });
            if (!ret.exist) {
                return undefined;
            }
            ret = fs.openSync({
                path: opts.path,
                flags: 'read_write'
            });
            if (ret.status) {
                fd = ret.fd
                ret = fs.readSync({
                    fd: fd
                });
                if (ret.status) {
                    var result = JSON.parse(ret.data);
                    ret = fs.closeSync({
                        fd: fd
                    });
                    if (ret.status) {
                        return result;
                    } else {
                        alert(JSON.stringify(ret));
                    }
                } else {
                    alert(JSON.stringify(ret));
                }
            } else {
                alert(JSON.stringify(ret));
            }
        },
        rmFile: function (opts, callback) {
            var ret, fs = api.require('fs');
            var fd = null;
            if (!opts.normal) opts.path = 'fs://data/' + opts.path;
            ret = fs.existSync({
                path: opts.path
            });
            if (ret.exist) {
                ret = fs.removeSync({
                    path: opts.path
                });
                if (ret.status) {
                    callback && callback(ret);
                } else {
                    alert(JSON.stringify(ret));
                }
            }
        },
        openPicActionSheet: function (opt) {
            opt = opt || {};
            var UIMediaScanner = api.require('UIAlbumBrowser');
            if (opt.type == 'UIMediaScanner' && !UIMediaScanner) {
                api.alert({
                    title: '提示',
                    msg: '没有引入模块 - UIMediaScanner'
                });
                return;
            }
            if (opt.recordVideo) {
                var btns = ['拍照', '录制视频', '从相册选择'];
            } else {
                //!以下注释为拍账王项目不需要
                // var btns = ['拍照', '从相册选择'];
                _g.getPhoto(2, opt);
            }
            //!以下注释为拍账王项目不需要
            // api.actionSheet({
            //     cancelTitle: '取消',
            //     buttons: btns
            // }, function (ret, err) {
            //     if (Number(ret.buttonIndex) == 1) {
            //         //camera
            //         _g.getPhoto(2, opt);
            //     } else if (Number(ret.buttonIndex) == 2 && btns.length == 3) {
            //         //录制视频
            //         _g.openWeChatCamera(opt);
            //     // } else if (Number(ret.buttonIndex) == 3 ||
            //     //     Number(ret.buttonIndex) == 2 && btns.length == 2) {
            //     } else if (Number(ret.buttonIndex) == btns.length) {
            //         if (opt.type == 'UIMediaScanner') {
            //             _g.openUIMediaScanner(opt);
            //         } else {
            //             //相册
            //             _g.getPhoto(1, opt);
            //         }
            //     }
            // });
        },
        openUIMediaScanner: function (opt) {
            console.log(JSON.stringify(opt));
            var UIMediaScanner = api.require('UIAlbumBrowser');
            UIMediaScanner.open({
                type: opt.sourceTpye || 'image',
                column: opt.column || 4,
                classify: opt.classify || false,
                // max: opt.max || 4,
                max: 999,
                sort: {
                    key: 'time',
                    order: 'desc'
                },
                texts: {
                    stateText: '已选择*项',
                    cancelText: '取消',
                    finishText: '完成'
                },
                styles: {
                    bg: '#fff',
                    mark: {
                        icon: '',
                        position: 'bottom_left',
                        size: 30
                    },
                    nav: {
                        bg: '#eee',
                        titleColor: '#000',
                        // stateColor: '#000',
                        // stateSize: 18,
                        cancelBg: 'rgba(0,0,0,0)',
                        cancelColor: '#000',
                        cancelSize: 18,
                        finishBg: 'rgba(0,0,0,0)',
                        finishColor: '#5F8FF2',
                        finishSize: 18,
                        numberSize: 28,
                        numberFontSize: 18,
                        numberCorner: 14,
                    },
                },
                // scrollToBottom: {
                //     intervalTime: 3,
                //     anim: true
                // },
                exchange: true,
                rotation: false,
                showBrowser: opt.showBrowser !== false
            }, function (ret, err) {
                if (ret) {
                    if (opt.suc) opt.suc(ret, 'UIMediaScanner');
                } else {
                    if (opt.err) opt.err(err);
                }
                ;
            });
        },
        getPhoto: function (type, opt) {
            var sourceType, destinationType = 'base64';
            switch (Number(type)) {
                case 1:
                    sourceType = 'library';
                    break;
                case 2:
                    sourceType = 'camera';
                    break;
                case 3:
                    sourceType = 'album';
                    break;
            }

            api.getPicture({
                sourceType: sourceType,
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: opt.destinationType || destinationType,
                allowEdit: !!opt.allowEdit,
                quality: 100,
                targetWidth: 2160,
                targetHeight: 2160,
                saveToPhotoAlbum: false
            }, function (ret, err) {
                if (ret) {
                    if (opt.suc) opt.suc(ret, 'camera');
                } else {
                    if (opt.err) opt.err(err);
                }
            });
        },
        openWeChatCamera: function (opt) {
            var weChatCamera = api.require('weChatCamera');
            weChatCamera.record({
                maxDuration: 10
            }, function (ret, err) {
                // _g.alert(ret)
                if (ret.status) {
                    var videoPath = ret.data.videoPath.replace(api.fsDir, 'fs:/');
                    _g.checkFileSize({
                        videoPath: ret.data.videoPath.replace(api.fsDir, 'fs:/'),
                        thumbnailPath: ret.data.thumbnailPath //绝对路径
                    }, opt);
                } else {
                    api.alert('录制时间过短');
                }
            });
        },
        checkFileSize: function (paths, opt) {
            var fs = api.require('fs');
            fs.getAttribute({
                path: paths.videoPath
            }, function (ret, err) {
                if (ret.status) {
                    // _g.videoCompression(path, opt);
                    // return
                    if (ret.attribute.size > 1024 * 1024 * 10) {
                        _g.showProgress();
                        _g.videoCompression(paths, opt);
                    } else {
                        opt.suc && opt.suc(paths);
                    }
                } else {
                    alert(JSON.stringify(err));
                }
            });
        },
        videoCompression: function (paths, opt) {
            var videoCompression = api.require('videoCompression');
            videoCompression.compression({
                path: paths.videoPath,
                quality: 'medium'
            }, function (ret) {
                if (ret.eventType == 'exporting') {
                    console.log(JSON.stringify(ret));
                } else if (ret.eventType == 'completed') {
                    if (api.systemType == 'ios') {
                        //不是保存在fs下,先保存到fs,在啥
                        _g.copyToFs({
                            videoPath: ret.path,
                            thumbnailPath: paths.thumbnailPath
                        }, opt);
                    } else {
                        //保存在fs下
                        _g.hideProgress();
                        opt.success && opt.success({
                            videoPath: ret.path.replace(api.fsDir, 'fs:/'),
                            thumbnailPath: paths.thumbnailPath
                        });
                    }
                }
            });
            _g.hideProgress();

        },
        copyToFs: function (paths, opt) {
            var fs = api.require('fs');
            var filename = paths.videoPath.split('/')[paths.videoPath.split('/').length - 1];
            fs.moveTo({
                oldPath: paths.videoPath,
                newPath: 'fs://video/'
            }, function (ret, err) {
                if (ret.status) {
                    fs.exist({
                        path: 'fs://video/' + filename
                    }, function (ret, err) {
                        if (ret.exist) {
                            opt.success && opt.success({
                                videoPath: 'fs://video/' + filename,
                                thumbnailPath: paths.thumbnailPath
                            });
                        } else {
                            // alert(JSON.stringify(err));
                        }
                    });
                } else {
                    // alert(JSON.stringify(err));
                }
            });
        },
        setPullDownRefresh: function (callback) {
            window.isSetPullDownRefresh = true;
            api.setCustomRefreshHeaderInfo({
                bgColor: '#fff',
                refreshHeaderHeight: 80,
                loadAnimInterval: 200,
                image: {
                    pull: (function () {
                        var list = [];
                        for (var i = 1; i <= 8; i++) {
                            list.push('widget://image/common/refresh/pull/' + i + '.png');
                        }
                        return list;
                    })(),
                    load: (function () {
                        var list = [];
                        for (var i = 1; i <= 12; i++) {
                            list.push('widget://image/common/refresh/load/' + i + '.png');
                        }
                        return list;
                    })()
                },
                isScale: false
            }, function (ret, err) {
                window.isNoMore = false;
                callback && callback();
            });

            // api.setRefreshHeaderInfo({
            //     visible: true,
            //     loadingImg: 'widget://image/refresh.png',
            //     bgColor: '#ccc',
            //     textColor: '#fff',
            //     textDown: '下拉刷新...',
            //     textUp: '松开刷新...',
            //     showTime: true
            // }, function (ret, err) {
            //     window.isNoMore = false;
            //     callback && callback();
            // });
        },
        setLoadmore: function (extra, callback) {
            extra = $.extend(true, { threshold: 200 }, extra);
            api.addEventListener({
                name: 'scrolltobottom',
                extra: extra
            }, function (ret, err) {
                if (window.isNoMore || window.isLoading) return;
                window.isLoading = true;
                callback && callback();
            });
        },
        refreshDone: function () {
            var loadmore = document.getElementById('loadmore');
            if (loadmore) document.body.removeChild(loadmore);
            api && api.refreshHeaderLoadDone();
            window.isLoading = false;
        },
        transData: function (data) {
            for (var d in data) {
                if (typeof data[d] == 'object') data[d] = JSON.stringify(data[d]);
            }
            return data;
        },
        avatar: function (avatar) {
            return avatar ? (CONFIG.HOST + avatar) : CONFIG.DEFAULT_AVATAR;
        },
        sex: function (sex) {
            return sex ? '男' : '女';
        },
        j2s: function (obj) {
            return JSON.stringify(obj);
        },
        s2j: function (s) {
            return JSON.parse(s);
        },
        log: function (msg) {
            $('body').attr('title', msg);
        },
        getTemplate: function (url) {
            var template = '';
            $.ajax({
                url: '../' + url + '.html',
                async: false,
                success: function (result) {
                    template = result;
                },
                error: function (msg) {
                    console.log('找不到:' + url + '模板,请检查');
                }
            });
            return template
        },
        frameReady: function () {
            api.execScript({
                name: api.winName,
                script: 'window.frameReady()'
            });
        },
        execScript: function (opts) {
            // var opts = {
            //     winName: 'winName', // 必填
            //     frameName: 'frameName', // 可选
            //     fnName: 'fnName', // 必填, 要执行的window.xxx, 只需要传入xxx
            //     data: {} // 可选, 规范必须传对象格式
            // };
            if (!opts) throw '_g.execScript : opts 不能为空';
            if (!opts.winName) throw '_g.execScript : winName 不能为空';
            if (!opts.fnName) throw '_g.execScript : fnName 不能为空';

            var _opts = {
                name: opts.winName
            };
            if (opts.frameName) _opts.frameName = opts.frameName;
            if (opts.data) {
                if (!_.isObject(opts.data)) throw '_g.execScript : data 规范为对象格式';
                _opts.script = 'window.' + opts.fnName + '(' + _g.j2s(opts.data) + ');';
            } else {
                _opts.script = 'window.' + opts.fnName + '();';
            }
            api.execScript(_opts);
        },
        alert: function () {
            var msg = _.map(arguments, function (item) {
                if (_.isObject(item)) {
                    return _g.j2s(item);
                } else {
                    return item;
                }
            });
            alert(msg.join('\r------\r'));
        },
        footballOpenExperDetail: function (opts) {
            this.openWin({
                header: {
                    title: '专家详情'
                },
                name: 'expert-detail-frame',
                url: '../expert/detail_frame.html',
                bounces: true,
                slidBackEnabled: false,
                pageParam: {
                    id: opts.id
                }
            }, 'normal')
        },
        getUserInfo: function (opts, callback) {
            opts.Http.ajax({
                url: '/app/v2/me/info.do',
                data: {},
                // isSync: true,
                lock: false,
                success: function (ret) {
                    callback(ret.data);
                }
            })
        },
        commonFollow: function (opts, callback) {
            opts.Http.ajax({
                url: '/app/me/favAdmin.do',
                data: {
                    adminUserId: opts.data.adminUserId,
                    status: opts.data.status
                },
                isSync: true,
                lock: false,
                success: function (ret) {
                    callback(ret);
                },
                error: function (err) {
                }
            })
        },
        checkUser: function (opts) {
            //opts.type 1.不跳转 2.跳转
            var opts = opts || {
                type: 2
            };
            if (_g.getLS('SessionKey')) {
                return true;
            } else if (opts.type == 2) {
                _g.openWin({
                    header: {},
                    name: 'account-login',
                    url: '../account/login_frame.html',
                    bounces: true,
                    slidBackEnabled: false,
                    pageParam: {
                        from: opts.from
                    }
                });
            } else if (opts.type == 1) {
                return false;
            }
        },
        getLastTime: function (lastTime) {
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - Date.parse(lastTime);
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC >= 1) {
                result = parseInt(monthC) + "个月前";
            } else if (weekC >= 1) {
                result = parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                result = parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                result = parseInt(hourC) + "个小时前";
            } else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else {
                if (new Date().getTime() - lastTime < 86400000) result = "刚刚发表";
                else result = new Date(lastTime).Format('yyyy-MM-dd');
            }
            return result;
        },
        imgCompress: function (compress, trans, opts, callback) {
            if (!_g.getLS('imgQuality') || (_g.getLS('imgQuality') && _g.getLS('imgQuality') == 'compress')) {
                var param = {
                    img: '',
                    quality: 1,
                    save: {
                        album: false,
                        imgPath: '',
                        imgName: ''
                    }
                };
                if (api.systemType === 'ios') {
                    param.size = {
                        w: 640,
                        h: 640
                    }
                }
                if (opts) {
                    if (opts.path) param.img = opts.path;
                    else {
                        _g.toast('请上传图片');
                        _g.hideProgress();
                        return;
                    }
                    if (opts.quality) param.quality = opts.quality;
                    if (opts.save) {
                        if (opts.save.album) param['save']['album'] = opts.save.album;
                        if (opts.save.imgPath) param['save']['imgPath'] = opts.save.imgPath;
                        if (opts.save.imgName) param['save']['imgName'] = opts.save.imgName;
                    }
                }
                compress.compress(param, function (ret, err) {
                    if (ret.status) {
                        _g.decodeImgToBase64(trans, opts.path, callback);
                    } else {
                        callback(err);
                    }
                });
            } else {
                _g.decodeImgToBase64(trans, 'fs://' + opts.path.substring(opts.path.lastIndexOf('/') + 1), callback);
            }
        },
        decodeImgToBase64: function (trans, path, callback) {
            trans.decodeImgToBase64({
                imgPath: path
            }, function (ret, err) {
                if (ret.status) {
                    ret.base64Str = 'data:image/png;base64,' + ret.base64Str;
                    callback(ret, null);
                } else {
                    callback(null, err);
                }
            });
        },
        getThirdData: function (opts, callback) {
            var responseData = {};
            if (opts.type === 'wx') {
                opts.bind.weChat(opts.wx, function (ret, err) {
                    if (ret) {
                        responseData.type = 'wx';
                        responseData.unionId = ret.unionid;
                        responseData.avatar = ret.headimgurl;
                        responseData.openId = ret.openId;
                        responseData.sex = ret.sex;
                        responseData.nickname = ret.nickname;
                        responseData.extraInfo = _g.j2s(ret);
                        callback(responseData);
                    } else {
                        if (!err.getUserInfo) _g.toast('微信用户信息获取失败');
                        else if (!err.getToken) _g.toast('微信授权失败');
                        else if (!err.auth) _g.toast('微信授权失败');
                        else if (!err.isInstalled) _g.toast('请安装微信客户端');
                    }
                });
            }
            // else if (opts.type === 'qq') {
            //     opts.bind.qq(opts.qq, function (ret, err) {
            //         if (ret) {
            //             ret.info = _g.s2j(ret.info);
            //             responseData.type = 'qq';
            //             responseData.headImgUrl = ret.info.figureurl_qq_2;
            //             responseData.openId = ret.openId;
            //             responseData.sex = ret.info.gender === '男' ? 1 : 2;
            //             responseData.nickname = ret.info.nickname;
            //             responseData.extraInfo = _g.j2s(ret);
            //             callback(responseData);
            //         } else {
            //             if (!err.getUserInfo) _g.toast('QQ用户信息获取失败');
            //             else if (!err.login) _g.toast('QQ登录失败');
            //             else if (!err.installed) _g.toast('请安装QQ客户端');
            //         }
            //     });
            // } else if (opts.type == 'weibo') {
            //     // TODO 回调地址
            //     opts.bind.weiBo(opts.weibo, function (ret, err) {
            //         if (ret) {
            //             if (typeof ret.userInfo == 'string') {
            //                 ret.info = _g.s2j(ret.userInfo);
            //             } else {
            //                 ret.info = ret.userInfo;
            //             }
            //             responseData.type = 'weibo';
            //             responseData.openId = ret.openId;
            //             if (ret.info.gender == 'm') responseData.sex = 1;
            //             else if (ret.info.gender == 'f') responseData.sex = 2;
            //             else responseData.sex = 3;
            //             responseData.nickname = ret.info.name;
            //             responseData.avatar = ret.info.profile_image_url;
            //             responseData.extraInfo = _g.j2s(ret.info);
            //             callback(responseData);
            //         } else {
            //             if (!err.getUserInfo) _g.toast('微博获取信息失败');
            //             else if (!err.auth) _g.toast('微博授权失败');
            //             else if (!err.isInstalled) _g.toast('请安装微博客户端');
            //         }
            //     });
            // }
        },
        thirdPerPay: function (opts, callback) {
            var action = {
                wx: function () {
                    var wxPay = api.require('wxPay');
                    wxPay.payOrder(opts.payParam, function (ret, err) {
                        callback && callback(ret, err);
                    });
                },
                ali: function () {
                    var aliPayPlus = api.require('aliPayPlus');
                    aliPayPlus.payOrder({ orderInfo: opts.payParam }, function (ret, err) {
                        callback && callback(ret, err);
                    });
                }
            };
            action[opts.payType] && action[opts.payType]();
            return
            opts.Http.ajax({
                url: opts.apiUrl,
                data: {
                    id: opts.reqData.id,
                    payType: opts.reqData.payType
                },
                isSync: true,
                lock: false,
                success: function (ret) {
                    if (Number(ret.code) == 200) {
                        if (Number(opts.reqData.payType) == 1) {
                            opts.wxPay.payOrder(ret.data, function (ret, err) {
                                callback(ret, err);
                            })
                        } else {
                            opts.aliPayPlus.payOrder({ orderInfo: ret.data.payParam }, function (ret, err) {
                                callback(ret, err);
                            })
                        }
                    }
                }
            });
        },
        photoBrowser: function (param, callback, err) {
            // param: {
            // 	picList: [],
            // 	bgColor: '#000',
            // 	activeIndex: 0,
            // 	placeholderImg: '' //默认placeholder.png
            // }
            var photoBrowser = api.require('photoBrowser');
            // param.picList = _.map(param.picList, function (item) {
            //     return CONFIG.HOST + item;
            // });
            photoBrowser.open({
                images: param.picList,
                placeholderImg: param.placeholderImg || 'widget://image/placeholder.png',
                bgColor: param.bgColor || '#000',
                activeIndex: param.activeIndex || 0
            }, function (ret, err) {
                if (ret) {
                    if (ret.eventType == 'click') {
                        photoBrowser.close();
                    }
                    callback && callback(ret, photoBrowser);
                } else {
                    _g.toast(JSON.stringify(err));
                }
            });
        },
        getLocationPage: function () {
            // var pageHistory = _g.getLS('pageHistory') || [];
            // return pageHistory[pageHistory.length - 1];
        },
        checkPage: function (winName) {
            // var winName = winName;
            // var flag = false;
            // var pageHistory = _g.getLS('pageHistory') || [];
            // _.each(pageHistory, function (item) {
            //     if (item.winName == winName) flag = true;
            // });
            // if (flag) {
            //     return true;
            // } else {
            //     return false;
            // }
        },
        pageDown: function (isBottom) {
            //滚到底部
            api.pageDown({
                bottom: isBottom || false
            }, function (ret) {
                console.log(_g.j2s(ret));
            });
        },
        checkUrl: function (url) {
            if (!url) {
                return url;
            } else if (url.indexOf('https') > -1 || url.indexOf('http') > -1) {
                return url;
            } else {
                return CONFIG.HOST + url;
            }
        },
        checkAvatar: function (url) {
            if (!url) {
                return 'widget://image/common/icon-avatat-default.png';
            } else if (url.indexOf('https') > -1 || url.indexOf('http') > -1) {
                return url;
            } else {
                return CONFIG.HOST + url;
            }
        },
        getActiveHouse: function (opts) {
            opts.Http.ajax({
                data: {},
                url: '/house/active.do',
                method: 'get',
                isSync: false,
                lock: false,
                success: function (ret) {
                    if (ret.code == 200) {
                        _g.setLS('ActiveHouse', ret.data);
                        opts.suc && opts.suc(ret.data);
                        api.sendEvent({
                            name: 'checkHouse',
                        })
                    } else if (ret.code == 3003) {
                        opts.fail && opts.fail();
                        if (!opts.from) {
                            _g.execScript({
                                winName: _g.getLS('rootWinName'),
                                fnName: 'loseActiveHouse'
                            });
                        }
                    }
                }
            })
        }
    };

    Common.prototype.constructor = Common;

    window._g = new Common();

    window.MagicVersion = !!_g.getLS('MagicVersion');
    if (_g.isAndroid) document.body.classList.add('isAndroid');
    var ua = window.navigator.userAgent;
    var isApp = ua.indexOf('(lrkjapp)') > -1;
    if (!isApp) window.MagicVersion = true;
    // if (isApp) {
    //     var closeWin = api.closeWin;
    //     var pageHistory = _g.getLS('pageHistory') || [];
    //     api.closeWin = function (opts) {
    //         var pageHistory = _g.getLS('pageHistory') || [];
    //         var opts = opts || {};
    //         var delIndex = -1;
    //         _.each(pageHistory, function (item, index) {
    //             if ((item.winName == opts.name || item.winName == api.winName) && delIndex == -1) {
    //                 var title = getTitle({winName: item.winName});
    //                 console.log('api.closeWin:' + title);
    //                 // td.onPageEnd({pageName: title});
    //                 delIndex = index;
    //             }
    //         });
    //         if (delIndex > -1) {
    //             pageHistory.splice(delIndex, 1);
    //             _g.setLS('pageHistory', pageHistory);
    //             if (_g.getLocationPage().frameName == 'me-index-frame' && api.systemType == 'ios') {
    //                 api.setStatusBarStyle({
    //                     style: 'light'
    //                 });
    //             }
    //             ;
    //             closeWin(opts);
    //         }
    //     };
    //     var closeToWin = api.closeToWin;
    //     api.closeToWin = function (opts) {
    //         var opts = opts || {};
    //         var pageHistory = _g.getLS('pageHistory') || [];
    //         var startIndex = -1;
    //         _.each(pageHistory, function (item, index) {
    //             if (opts.name == item.winName) {
    //                 startIndex = index + 1;
    //                 var title = getTitle({winName: item.winName});
    //                 console.log(title);
    //                 // td.onPageEnd({pageName: title});
    //             }
    //         });
    //         pageHistory.splice(startIndex, pageHistory.length);
    //         _g.setLS('pageHistory', pageHistory);
    //         if (_g.getLocationPage().frameName == 'me-index-frame' && api.systemType == 'ios') {
    //             api.setStatusBarStyle({
    //                 style: 'light'
    //             });
    //         }
    //         ;
    //         console.log(_g.j2s(_g.getLS('pageHistory')));
    //         closeToWin(opts);
    //     };
    // }
})();
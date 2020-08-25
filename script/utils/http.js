define(function (require, exports, module) {

    // Usage
    // -----------------------------
    // var Http = require('U/http');
    // Http.ajax({
    //     data: { user_phone: 13800138005, password: 123123},
    //     url: '/app/user/login.do',
    //     success: function(ret){},
    //     error: function(err){},

    // });

    var MD5 = require('U/md5'); // MD5('string')
    var Ksort = require('U/ksort'); // Ksort(object)
    var UserInfo = _g.getLS('UserInfo');
    var sessionKey = _g.getLS('SessionKey');

    function Http() {
        this._opts = {
            // 接口版本号
            apiVersions: 'v1',
            // app版本号
            appVersion: api ? api.appVersion : '0.0.0',
            // 设备唯一标识
            deviceCode: api ? api.deviceId : 'developer',
            // 平台标识
            platform: api ? (function () {
                if (api.systemType === 'android') return 1;
                else if (api.systemType === 'ios') return 2;
                else if (api.systemType === 'web') return 0;
            })() : 0,
            // 接口请求参数 Json格式，如果无值，可留空或直接传递{}
            data: null,
            // 当前登录SESSIONKEY，登录时由接口返回，如果没有，则留空
            // sessionKey: (UserInfo && UserInfo.sessionKey) ? UserInfo.sessionKey : '',
            // 用户id，当前登录的用户id，登录时由接口返回，如果没有，则留空
            // user_id: (UserInfo && UserInfo.user_id) ? UserInfo.user_id : 0,
            // 10位时间戳
            // yangMan0606注释
            // timestamp: Number(new Date().getTime().toString().substring(0, 10)),
            // MD5加密串
            // yangMan0606注释
            // token: '7aeeb7da08390a43f73f97e3bc319c79',
        };
        // this._opts = {
        //     // 接口版本号
        //     apiVersions: 'v1',
        //     // app版本号
        //     appVersion: api ? api.appVersion : '0.0.0',
        //     // 设备唯一标识
        //     deviceCode: api ? api.deviceId : 'developer',
        //     // sessionKey
        //     sessionKey: sessionKey || '',
        //     // 平台标识
        //     platform: api ? (function () {
        //         if (api.systemType === 'android') return 1;
        //         else if (api.systemType === 'ios') return 2;
        //         else if (api.systemType === 'web') return 0;
        //     })() : 0,
        //     // 10位时间戳
        //     timestamp: (new Date()).getTime() / 1000,
        // };

        this.isLock = false;
    }

    Http.prototype = {
        jsonToPostDataStr: function (json) {
            var PostDataStr = '';
            for (var i in json) {
                if (i == 'data') {
                    PostDataStr += i + '=' + JSON.stringify(json[i]) + '&';
                } else {
                    PostDataStr += i + '=' + json[i] + '&';
                }
            }
            return PostDataStr == '' ? PostDataStr : PostDataStr.slice(0, -1);
        },
        fetchToken: function (postData) {
            return MD5(this.jsonToPostDataStr(Ksort(postData)));
        },
        fetchPostData: function (data) {
            // this.update();
            // var postData = $.extend(true, {}, this._opts);
            // postData.data = $.extend(true, {}, data);
            // postData.token = this.fetchToken(postData);
            // return postData;
            this.update();
            //!注释一些不必要的传参
            // var postData = $.extend(true, {}, this._opts);
            // postData.data = Ksort($.extend(true, {}, data));
            // postData.data.appSessionKey = _g.getLS('SessionKey');
            // postData.timestamp = Math.round(new Date().getTime() / 1000);
            //TODO此处为注释后的
            // _g.alert(data,"tixing1")
            var postData = $.extend(true, {}, this._opts.data);
            // _g.alert(data,"tixing2")
            postData.data = Ksort($.extend(true, {}, data));
            // _g.alert(postData.data)

            return postData;
        },
        ajax: function (opts) {
            if (['none', 'unknown'].indexOf(api.connectionType) > -1) {
                return
            }
            var startTime = new Date().getTime();
            _g.setLS('LastTime', startTime);
            var self = this;
            if (self.isLock) return;
            if (!opts.data || !opts.url) return;

            var postData = self.fetchPostData(opts.data);

            if (opts.lock !== false) self.lock();
            if (opts.isSync) _g.showProgress();
            // _g.alert(opts.isJson)
            if (opts.isFile) {
                var data = {
                    files: postData.data
                };
                // _g.alert(data)
                var time = opts.time
                if (time) {

                    var header = {
                        "Token": _g.getLS('token'),
                        "time": opts.time,
                        userId: _g.getLS("userId")
                    };
                } else {
                    var header = {
                        "Token": _g.getLS('token'),
                    };
                }

            } else if(opts.isVant) {
                //改写vant 文件上传方法
                var data = postData
                var header = {
                    "Content-Type" : "multipart/form-data;boundary="+ new Date().getTime()
                }

            } else if (opts.isJson) {
                var data = {
                    body: postData.data
                }

                var header = {
                    "Token": _g.getLS('token'),
                    "Content-Type": "application/json;charset=UTF-8"
                };
            } else {
                var data = {
                    values: postData
                };

                var header = {
                    "Token": _g.getLS('token'),
                    "Content-Type": "application/json;charset=UTF-8"
                };
            }
            api && api.ajax({
                url: !opts.isTestPay ? CONFIG.HOST + opts.url : opts.url,
                method: opts.method || 'post',
                timeout: 60 * 20,
                dataType: 'json',
                returnAll: false,
                charset: 'utf-8',
                headers: header,
                data: data
            }, function (ret, err) {
                self.unlock();
                window.isLoading = false;
                if (window.isSetPullDownRefresh) _g.refreshDone();
                if (opts.isSync) {
                    setTimeout(function () {
                        _g.hideProgress();
                    }, 200);
                }
                if (ret) {
                    ret.code = parseInt(ret.code);
                    _g.hideProgress();
                    if (ret.code != 200) {
                        _g.alert(ret.message);
                    }
                    setTimeout(function () {
                        opts.success && opts.success(ret);
                    }, 0);
                } else {
                    // _g.toast('错误接口：'+opts.url+'，错误码：'+err.code+'，错误信息：'+err.msg+'，网络状态码：'+err.statusCode);
                    console.log(err)
                    _g.toast('网络连接失败, 请检查网络!');
                    _g.hideProgress();
                    opts.error && opts.error(err);
                }
            });
            // _g.alert(header)
            // _g.alert(data)

        },
        lock: function () {
            this.isLock = true;
        },
        unlock: function () {
            this.isLock = false;
        },
        update: function () {
            var UserInfo = _g.getLS('UserInfo');
            var sessionKey = _g.getLS('SessionKey');
            this._opts.sessionKey = sessionKey || '';
        }
    };

    Http.prototype.constructor = Http;

    module.exports = new Http();

});

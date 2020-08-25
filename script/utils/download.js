define(function (require, exports, module) {

    // var Download = require('U/download');
    // var ret = Download.setStore('test');
    // Download.start({
    //     url: 'https://cdn4.buysellads.net/uu/1/41334/1550855401-cc_light.png',
    //     callback: function(ret) {
    //         console.log(JSON.stringify(ret));
    //     }
    // }, 'test');
    // Download.getStore('test', function(ret) {
    //     console.log(JSON.stringify(ret));
    // });
    // Download.delStore('test', function(ret) {
    //     console.log(JSON.stringify(ret));
    // });
    // Download.query({
    //     callback: function(data) {
    //         console.log(JSON.stringify(data));
    //     }
    // }, 1);
    // 下载管理SDK
    // 依赖fs, downloadManager 模块

    function Download() {
        this.fs = api.require('fs');
        this.dm = api.require('downloadManager');
        this.NETWORK = {
            MOBILE: 'mobile', // 手机网络
            WIFI: 'wifi', // wifi网络
            ALL: 'all' // 手机和wifi网络
        };
        this.STATUS = {
            WAIT: 0, // 等待下载
            DOWNLOAD: 1, // 正在下载
            PAUSE: 2, // 暂停状态，等待恢复或被重新唤醒
            SUCCESS: 3, // 下载成功
            ERROR: 4 // 下载发生错误
        };
        this.ERROR = {
            UN_KNOW_ERROR: 1000, // 未知错误
            FULL: 1001, // 存储已满
            NOT_FIND_STORE: 1002, // 未发现存储设备
            REDIRECT: 1003, // 目标资源发生了重定向
            NETWORK_RESOURCE_ERROR: 1004 // 网络资源错误
        };
        this.ROOT = 'fs://lrkj_download/';
        this.TEMP = 'temp/';
        this.DATA = 'data.txt';
        this.INTERVAL = 1000; //回调的时间间隔,默认1000
        // 判断是否创建默认存储路径
        var ret = this.fs.existSync({
            path: this.ROOT
        });
        // console.log(JSON.stringify(ret));
        if (!ret.exist) {
            ret = this.fs.createDirSync({
                path: this.ROOT
            });
            ret = this.fs.createFileSync({
                path: this.ROOT + this.DATA
            });
        }
        // 判断是否创建临时仓库路径
        ret = this.fs.existSync({
            path: this.ROOT + this.TEMP
        });
        // console.log(JSON.stringify(ret));
        if (!ret.exist) {
            ret = this.fs.createDirSync({
                path: this.ROOT + this.TEMP
            });
            if (ret.status) {
                ret = this.fs.createFileSync({
                    path: this.ROOT + this.TEMP + this.DATA
                });
                ret = this.setData(this.ROOT, {
                    temp: {
                        path: this.ROOT + this.TEMP,
                        time: new Date().getTime()
                    }
                });
                // console.log(JSON.stringify(ret));
                ret = this.setData(this.ROOT + this.TEMP, {});
                // console.log(JSON.stringify(ret));
            }
        }
    }

    Download.prototype = {
        getData: function (path) {
            console.log(path);
            console.log(this.fs.readByLengthSync({
                path: path + this.DATA
            }).content);
            return JSON.parse(this.fs.readByLengthSync({
                path: path + this.DATA
            }).content);
        },
        setData: function (path, data) {
            return this.fs.writeByLengthSync({
                path: path + this.DATA,
                content: JSON.stringify(data)
            });
        },
        // 设置下载仓库
        setStore: function (store) {
            var path = this.ROOT + store + '/';
            var ret = this.fs.createDirSync({
                path: path
            });
            if (ret.status) {
                ret = this.fs.createFileSync({
                    path: path + this.DATA
                });
                var data = this.getData(this.ROOT);
                data[store] = {
                    path: path,
                    time: new Date().getTime()
                };
                this.setData(this.ROOT, data);
                this.setData(path, {});
            }
            return ret;
        },
        // 查询下载仓库
        getStore: function (store, callback) {
            var ret = this.fs.existSync({
                path: this.ROOT + store + '/' + this.DATA
            });
            if (!ret.exist) {
                callback && callback([]);
            } else {
                var self = this;
                var storePath = store ? (this.ROOT + store + '/') : (this.ROOT + this.TEMP);
                var data = self.getData(storePath);
                var ids = _.map(data, function (val, id) {
                    return Number(id);
                });
                if (callback) {
                    self.query({
                        ids: ids,
                        store: store,
                        callback: callback
                    });
                }
            }
        },
        // 删除下载仓库
        delStore: function (store, callback) {
            var self = this;
            var storePath = store ? (this.ROOT + store + '/') : (this.ROOT + this.TEMP);
            var data = self.getData(storePath);
            var ids = _.map(data, function (val, id) {
                return Number(id);
            });
            self.remove({
                ids: ids,
                callback: callback
            }, store);
        },
        // 开始下载
        start: function (opts, store) {
            // opts.url
            // opts.data
            // opts.interval
            // opts.callback
            var self = this;
            if (!opts.url) return _g.toast('资源地址不能为空');
            var file = new Date().getTime() + Math.round(Math.random() * 999);
            var storePath = store ? (this.ROOT + store + '/') : (this.ROOT + this.TEMP);
            if (store) this.setStore(store);
            var defaultOpts = {
                url: '', // 资源地址
                savePath: storePath + file, // 存储路径
                encode: true, // 对url进行编码
                cache: false, // 使用缓存
                allowResume: true, // 开启断点续传
                networkTypes: this.NETWORK.ALL // 允许自动下载的网络环境
            };
            var interval = opts.interval || this.INTERVAL;
            var callback = opts.callback;
            delete opts.interval;
            delete opts.callback;
            var params = _.extend({}, defaultOpts, opts);
            this.dm.enqueue(params, function (ret, err) {
                if (ret) {
                    var data = self.getData(storePath);
                    data[ret.id] = {
                        path: storePath + file,
                        data: opts.data,
                        time: new Date().getTime()
                    };
                    self.setData(storePath, data);
                    if (callback) {
                        self.query({
                            id: ret.id,
                            store: store,
                            interval: interval,
                            callback: callback
                        });
                    }
                } else {
                    alert(JSON.stringify(err));
                }
            });
        },
        // 暂停下载
        pause: function (opts) {
            // opts.id
            // opts.callback
            var callback = opts.callback;
            var params = {};
            if (opts.id) params.id = opts.id;
            this.dm.pause(params, function (ret, err) {
                if (ret.status) {
                    callback && callback(ret);
                } else {
                    alert(JSON.stringify(err));
                }
            });
        },
        // 继续下载
        resume: function (opts) {
            // opts.id
            // opts.callback
            var callback = opts.callback;
            var params = {};
            if (opts.id) params.id = opts.id;
            this.dm.resume(params, function (ret, err) {
                if (ret.status) {
                    callback && callback(ret);
                } else {
                    alert(JSON.stringify(err));
                }
            });
        },
        // 删除下载
        remove: function (opts, store) {
            // opts.id
            // opts.ids
            // opts.callback
            var self = this;
            var storePath = store ? (this.ROOT + store + '/') : (this.ROOT + this.TEMP);
            var callback = opts.callback;
            var params = {
                deleteFiles: true
            };
            if (opts.id) params.ids = [opts.id];
            if (opts.ids) params.ids = opts.ids;
            this.dm.remove(params, function (ret, err) {
                if (ret) {
                    var data = self.getData(storePath);
                    _.each(opts.ids, function (id) {
                        self.fs.remove({
                            path: data[id].path
                        });
                        delete data[id];
                    });
                    self.setData(storePath, data);
                    callback && callback(ret);
                } else {
                    alert(JSON.stringify(err));
                }
            });
        },
        // 查询下载状态
        query: function (opts, autoStop) {
            // opts.id
            // opts.ids
            // opts.status
            // opts.store
            // opts.interval
            // opts.callback
            var self = this;
            var interval = opts.interval || this.INTERVAL;
            var callback = opts.callback;
            var store = opts.store;
            var storePath = store ? (this.ROOT + store + '/') : (this.ROOT + this.TEMP);
            var params = {};
            if (opts.id) params.ids = [opts.id];
            if (opts.ids) params.ids = opts.ids;
            if (opts.status) params.status = opts.status;
            this.dm.query(params, function (ret, err) {
                if (ret) {
                    var list = ret.data;
                    var data = self.getData(storePath);
                    if (callback) {
                        callback(_.map(list, function (item) {
                            return _.extend({}, item, data[item.id]);
                        }));
                        if (autoStop !== false) {
                            var match = _.filter(list, function (item) {
                                return [self.STATUS.WAIT, self.STATUS.DOWNLOAD, self.STATUS.PAUSE].indexOf(item.status) > -1;
                            });
                            if (match.length) {
                                setTimeout(function () {
                                    self.query(opts, autoStop);
                                }, interval);
                            }
                        } else {
                            setTimeout(function () {
                                self.query(opts, autoStop);
                            }, interval);
                        }
                    }
                } else {
                    alert(JSON.stringify(err));
                }
            });
        }
    };

    Download.prototype.constructor = Download;

    module.exports = new Download();

});

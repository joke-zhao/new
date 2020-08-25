define(function(require, exports, module) {
    var UIMediaScanner = api.require('UIAlbumBrowser');
    var FNImageClip = api.require('FNImageClip');
    var button = api.require('UIButton');
    var fs = api.require('fs');
    var imageName = ''; //图片文件名
    var newPath = 'fs://' + 'paizhangwang' + '/photo'; //新路径,不包括图片文件名
    var newUrl = ''; //新路径,包括图片文件名
    var clipImage = ''; //剪裁后路径,包括文件名
    var btns = {
        closeBtnId: -1,
        saveBtnId: -1
    };

    function ImageClip() {

    }

    ImageClip.prototype = {
        init: function() {

        },
        openPicActionSheet: function() {
            var self = this;
            _g.openPicActionSheet({
                allowEdit: false,
                destinationType: 'url',
                suc: function(ret) {
                    self.copyTo(ret.data);
                }
            });
        },
        copyTo: function(path) {
            var self = this;
            imageName = path.split('/')[path.split('/').length - 1];
            var copyToRet = fs.copyToSync({
                oldPath: path,
                newPath: newPath
            });
            if (copyToRet.status) {
                newUrl = newPath + '/' + imageName;
                self.openImageClip(newUrl);
            }
        },
        openImageClip: function(path) {
            var self = this;
            FNImageClip.open({
                rect: {
                    x: 0,
                    y: 0,
                    w: api.winWidth,
                    h: api.frameHeight
                },
                //TODO 截取原图分辨率
                highDefinition:true,
                srcPath: path,
                style: {
                    mask: 'rgba(0,0,0,0.4)',
                    clip: {
                        w: api.frameWidth - 20,
                        h: api.frameWidth - 20,
                        x: 10,
                        y: (api.frameHeight - api.frameWidth + 20 - ((api.winHeight - api.frameHeight) / 2)) / 2,
                        borderColor: '#fff',
                        borderWidth: 1,
                        appearance: 'rectangle'
                    }
                },
                mode: 'clip',
                fixedOn: api.frameName
            }, function(ret, err) {
                if (ret) {
                    if (ret.status) {
                        api.setFrameAttr({
                            name: api.frameName,
                            bounces: false
                        });
                        self.openButtons();
                    }
                } else {
                    // alert(JSON.stringify(err));
                }
            });
        },
        saveImageClip: function() {
            var self = this;
            clipImage = newPath + '/clip/' + imageName;
            FNImageClip.save({
                destPath: clipImage,
                copyToAlbum: false,
                quality: 1
            }, function(ret, err) {
                if (ret) {
                    var checkTimer = setInterval(function() {
                        var ret = fs.existSync({
                            path: clipImage
                        });
                        if (ret.exist) {
                            clearInterval(checkTimer);
                            window.clipFinish(clipImage);
                            self.closeFNImageClip()
                        }
                    }, 300);
                } else {
                    // alert(JSON.stringify(err));
                }
            });
        },
        closeFNImageClip: function() {
            var self = this;
            FNImageClip.close();
            api.setFrameAttr({
                name: api.frameName,
                bounces: true
            });
            button.close({
                id: btns.saveBtnId
            });
            button.close({
                id: btns.closeBtnId
            });
            self.clearFs();
        },
        openButtons: function() {
            var self = this;
            button.open({
                rect: {
                    w: 100,
                    h: 88 * api.frameWidth / 720,
                    x: 10,
                    y: api.frameHeight - 88 * api.frameWidth / 720,
                },
                corner: 5,
                bg: {
                    normal: 'rgba(0,0,0,0)',
                    highlight: 'rgba(0,0,0,0)',
                    active: 'rgba(0,0,0,0)'
                },
                title: {
                    size: 16,
                    highlight: '取消',
                    active: '取消',
                    normal: '取消',
                    highlightColor: '#fff',
                    activeColor: '#fff',
                    normalColor: '#fff',
                    alignment: 'left'
                },
                fixedOn: api.frameName,
                fixed: true,
                move: true
            }, function(ret, err) {
                if (ret) {
                    if (ret.id > -1) {
                        btns.closeBtnId = ret.id;
                    }
                    if (ret.eventType == 'click') {
                        self.closeFNImageClip();
                    }
                } else {}
            });
            button.open({
                rect: {
                    w: 100,
                    h: 88 * api.frameWidth / 720,
                    x: api.frameWidth - 10 - 100,
                    y: api.frameHeight - 88 * api.frameWidth / 720,
                },
                corner: 5,
                bg: {
                    normal: 'rgba(0,0,0,0)',
                    highlight: 'rgba(0,0,0,0)',
                    active: 'rgba(0,0,0,0)'
                },
                title: {
                    size: 16,
                    highlight: '确定',
                    active: '确定',
                    normal: '确定',
                    highlightColor: '#fff',
                    activeColor: '#fff',
                    normalColor: '#fff',
                    alignment: 'right'
                },
                fixedOn: api.frameName,
                fixed: true,
                move: true
            }, function(ret, err) {
                if (ret) {
                    if (ret.id > -1) {
                        btns.saveBtnId = ret.id;
                    }
                    if (ret.eventType == 'click') {
                        self.saveImageClip('fs://avatar/' + 'paizhangwang' + 'new.jpg');
                    }
                } else {}
            });
        },
        clearFs: function() {
            // var self = this;
            // //清除多余文件
            // fs.remove({
            //     path: newUrl
            // }, function(ret, err) {
            //     if (ret.status) {
            //         // alert(JSON.stringify(ret));
            //     } else {
            //         // alert(JSON.stringify(err));
            //     }
            // });
            // fs.remove({
            //     path: clipImage
            // }, function(ret, err) {
            //     if (ret.status) {
            //         // alert(JSON.stringify(ret));
            //     } else {
            //         // alert(JSON.stringify(err));
            //     }
            // });
        }
    };

    ImageClip.prototype.constructor = ImageClip;
    module.exports = new ImageClip();

});

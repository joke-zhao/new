define(function(require, exports, module) {

    // H5移动端图片上传, 以BASE64上传
    // 依赖Zepto库
    // 只需要执行初始化init就可以了, 需要创建一个input:file的表单, 指定ID
    require('L/photo/jpeg_encoder_basic');
    require('L/photo/load-image.all.min');

    var photoWidth = window.innerWidth * 2;

    function Photo() {
        this.ready = false;
        this.opts = {
            uploadList: [{
                id: '',
                callback: function() {},
            }]
        };
        this.callbacks = {};
    }

    Photo.prototype = {
        init: function(opts) {
            var self = this;
            this.reset();
            this.opts = $.extend(true, this.opts, opts);
            if (window.createObjectURL || window.URL || window.webkitURL || window.FileReader) {
                $.each(this.opts.uploadList, function(index, item) {
                    $('#' + item.id).off('change', self._dropChangeHandler).on('change', self._dropChangeHandler);
                    self.callbacks[item.id] = function(img) {
                        var base64 = self._fetchBase64(img);
                        item.callback && item.callback(base64, item.id);
                    };
                });
                this.ready = true;
            } else {
                alert('您的浏览器不支持图片上传功能！？请换一个浏览器再试~');
            }
        },
        upload: function() {
            if (!this.ready) {
                console.log('Photo is not ready, use \"init()\" before');
                return;
            }
        },
        reset: function() {
            this.callback = {};
            this.opts = {
                uploadList: [{
                    id: '',
                    callback: function() {},
                }]
            };
        },
        _displayImage: function(file, options, upload_id) {
            currentFile = file;
            var replaceResults = this.callbacks[upload_id];
            if (!loadImage(file, replaceResults, options)) {
                alert('您的浏览器不支持图片上传功能！？请换一个浏览器再试~');
            }
        },
        _dropChangeHandler: function(e) {
            e.preventDefault();
            $('#loadingPage').show();
            var target = e.target,
                file = target && target.files && target.files[0],
                options = {
                    maxWidth: photoWidth,
                    canvas: false
                };
            if (!file) {
                return;
            }

            var upload_id = e.target.id;

            loadImage.parseMetaData(file, function(data) {
                if (data.exif) {
                    options.orientation = data.exif.get('Orientation');
                }
                _photo_._displayImage(file, options, upload_id);
            });
        },
        _fetchBase64: function(img) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, img.width, img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

            var base64 = '';
            var ua = navigator.userAgent.toLowerCase();
            var quality = 0.9;
            if (ua.indexOf('mac') > 0) {
                quality = 0.9;
                base64 = canvas.toDataURL('image/jpeg', quality);
            } else {
                var encoder = new JPEGEncoder();
                var data = encoder.encode(ctx.getImageData(0, 0, img.width, img.height), 60);
                base64 = data;
            }
            return base64;
        }
    };

    Photo.prototype.constructor = Photo;
    var _photo_ = new Photo();
    module.exports = _photo_;

});

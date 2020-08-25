define(function(require, exports, module) {

    // <div id="window" class="window">
    //     <canvas id="canvas"></canvas>
    //     <img src="background.png">
    // </div>

    // var scratch = new Scratch('canvas',function(pt){
    //     if (pt-0>60) {
    //         scratch.destroy();
    //     };
    // });
    // scratch.init();

    function Scratch(id, drawPercentCallback, cover, coverType) {
        this.conId = id;
        this.conNode = document.getElementById(this.conId);
        var style = this.conNode.style;
        style.backgroundColor = 'transparent';
        style.position = 'absolute';
        style.top = '0';
        style.left = '0';
        style.width = '100%';
        style.height = '100%';
        style.margin = '0';
        style.padding = '0';
        this.cover = cover || '#CCC';
        this.coverType = coverType || 'color';
        this.background = null;
        this.ctx = this.conNode.getContext('2d');
        this.width = this.conNode.clientWidth;
        this.height = this.conNode.clientHeight;
        this.drawPercentCallback = drawPercentCallback;
        this.prev = {x : undefined, y : undefined};
    }

    Scratch.prototype = {
        getTransparentPercent: function(width, height) {
            var imgData = this.ctx.getImageData(0, 0, width, height),
                pixles = imgData.data,
                transPixs = [];
            for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                    transPixs.push(i);
                }
            }
            return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
        },
        resizeCanvas: function (canvas, width, height) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').clearRect(0, 0, width, height);
        },
        drawPoint: function (x, y) {
            var ctx = this.ctx;
            ctx.beginPath();
            // var radgrad = ctx.createRadialGradient(x, y, 0, x, y, 30);
            // radgrad.addColorStop(0, 'rgba(0,0,0,1)');
            // radgrad.addColorStop(1, 'rgba(255,255,255,0)');
            // ctx.fillStyle = radgrad;
            ctx.fillStyle = '#000';
            ctx.arc(x, y, 30, 0, Math.PI * 2, true);
            ctx.fill();

            if (!!this.prev.x&&!!this.prev.y) {
                ctx.beginPath();
                ctx.lineWidth = 60;
                ctx.lineCap = ctx.lineJoin = "round";
                ctx.moveTo(this.prev.x,this.prev.y);
                ctx.lineTo(x,y);
                ctx.stroke();
            }

            this.prev.x = x;
            this.prev.y = y;
            if (this.drawPercentCallback) {
                this.drawPercentCallback.call(null, this.getTransparentPercent(this.width, this.height));
            }
        },
        bindEvent: function () {
            var self = this;

            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, false);

            this.touchStartCallBack = function(e) {
                self.drawPoint(e.touches[0].clientX, e.touches[0].clientY);
            }
            this.touchMoveCallBack = function(e) {
                self.drawPoint(e.touches[0].clientX, e.touches[0].clientY);
            }
            this.touchEndCallBack = function(e) {
                self.prev.x = undefined;
                self.prev.y = undefined;
            }
            this.conNode.addEventListener('touchstart', this.touchStartCallBack, false);
            this.conNode.addEventListener('touchmove', this.touchMoveCallBack, false);
            this.conNode.addEventListener('touchend', this.touchEndCallBack, false);
        },
        removeEvent : function(){
            this.conNode.removeEventListener('touchstart', this.touchStartCallBack, false);
            this.conNode.removeEventListener('touchmove', this.touchMoveCallBack, false);
            this.conNode.removeEventListener('touchend', this.touchEndCallBack, false);
        },
        drawCoating : function(){
            if (this.coverType == 'color') {
                this.ctx.fillStyle = this.cover;
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.globalCompositeOperation = 'destination-out';
            } else if (this.coverType == 'image'){
                var image = new Image(),
                    self = this;
                image.onload = function () {
                    self.ctx.drawImage(this, 0, 0);
                    self.ctx.globalCompositeOperation = 'destination-out';
                }
                image.src = this.cover;
            }
        },
        destroy : function(){
            var self = this;
            var counter = 9;
            this.removeEvent();
            (function fade(){
                if (counter<=0) {
                    self.conNode.remove()
                }else{
                    self.conNode.style.opacity = '0.'+counter;
                    counter--;
                    counter--;
                    setTimeout(fade,167)
                }
            })()
        },
        init : function(){
            this.resizeCanvas(this.conNode,this.width,this.height)
            this.bindEvent()
            this.drawCoating()
        }
    };

    Scratch.prototype.constructor = Scratch;

    module.exports = Scratch;

});

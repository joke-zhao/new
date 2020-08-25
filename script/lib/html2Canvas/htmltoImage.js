
var htmltoImage = {
	el: '',
	callback: '',
	base64str: '',
	imageObject: '',
	isImageObject: false,
	init: function(params, callback) {
		if("undefined" != typeof params.el) {
			this.el = params.el;
		} else {
			this.el = document.body;
		}
		if("undefined" != typeof params.isImageObject) {
			this.isImageObject = params.isImageObject;
		}
		this.callback = callback;

		this.setListener();
	},
	showLoad: function() {
		api.showProgress({
		    title: '生成图片中...',
		    text: '先喝杯茶...',
		    modal: false
		});
	},
	closeLoad: function() {
		api.hideProgress();
	},
	setListener: function() {
		var that = this;
		this.showLoad();
		setTimeout(function() {
			that.html2Canvas()
		}, 1000);

	},

	getPixelRatio: function(context) {
		var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;
		return(window.devicePixelRatio || 1) / backingStore;
	},

	html2Canvas: function() {
		var that = this;
		var saveContent = this.el;
		var width = saveContent.offsetWidth;
		var height = saveContent.offsetHeight;
		var offsetTop = saveContent.offsetTop;
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var scaleBy = this.getPixelRatio(context);
		canvas.width = width * scaleBy;
		canvas.height = (height + offsetTop) * scaleBy;
		context.scale(scaleBy, scaleBy);
		var opts = {
			allowTaint: true,
			tainttest: true,
			scale: scaleBy,
			canvas: canvas,
			logging: false,
			width: width,
			height: height,
			background: '#d9e9f5'
		};
		try{
			html2canvas(saveContent, opts).then(function(canvas) {
				var imageObject = that.convertCanvasToImage(canvas);
				if(that.isImageObject){
					that.imageObject = imageObject;
				}
				that.returnData(true);
			});
		}catch(err){
			that.returnData(false);
		}
		
	},
	returnData: function(result){
		this.closeLoad();
		if(result) {
			this.callback({
				'ret' : 1,
				'msg': '成功',
				'base64str': this.base64str,
				'imageObject': this.imageObject
			}, {});
		} else {
			this.callback({}, {
				'ret' : 0,
				'msg': '失败',
			});
		}
		
	},
	convertCanvasToImage: function(canvas) {
		var image = new Image();
		this.base64str = canvas.toDataURL("image/png");
		image.src = this.base64str;
		return image;
	},
	cutprefixBase64: function(base64Str){
		return base64Str.replace(/^data:image\/\w+;base64,/, "");
	}
};

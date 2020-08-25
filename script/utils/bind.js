define(function (require, exports, module) {

	// 绑定微信,QQ,微博模块
	var Http = require('U/http');

	function Bind() {
		this.param = {};

	}

	Bind.prototype = {
		weChat: function (obj, callback) {
			var openId = '';
			obj.isInstalled(function (ret, err) {
				if (ret.installed) {
					obj.auth(function (ret, err) {
						if (ret.status && ret.code) {
							obj.getToken({
								code: ret.code
							}, function (ret, err) {
								if (ret.status) {
									openId = ret.openId;
									obj.getUserInfo({
										accessToken: ret.accessToken,
										openId: openId,
									}, function (ret, err) {
										if (ret.status) {
											ret.openId = openId;
											callback(ret, null);
										} else {
											ret.getUserInfo = false;
											callback(null, ret);
										}
									})
								} else {
									ret.getToken = false;
									callback(null, ret);
								}
							})
						} else {
							ret.auth = false;
							callback(null, ret);
						}
					})
				} else {
					ret.isInstalled = false;
					callback(null, ret);
				}
			});
		},
		// qq: function (obj, callback) {
		// 	var openId = '';
		// 	obj.installed(function (ret, err) {
		// 		if (ret.status) {
		// 			obj.login(function (ret, err) {
		// 				if (ret.status) {
		// 					openId = ret.openId;
		// 					obj.getUserInfo(function (ret, err) {
		// 						if (ret.status) {
		// 							ret.openId = openId;
		// 							callback(ret);
		// 						} else {
		// 							ret.getUserInfo = false;
		// 							callback(null, ret);
		// 						}
		// 					})
		// 				} else {
		// 					ret.login = false;
		// 					callback(null, ret);
		// 				}
		// 			});
		// 		} else {
		// 			ret.installed = false;
		// 			callback(null, ret);
		// 		}
		// 	});
		// },
		// weiBo: function (obj, callback) {
		// 	var openId = '';
		// 	obj.isInstalled(function (ret, err) {
		// 		if (ret.status) {
		// 			obj.auth({
		// 				registUrl: ''
		// 			}, function (ret, err) {
		// 				if (ret.status) {
		// 					openId = ret.userId;
		// 					obj.getUserInfo(function (ret, err) {
		// 						if (ret.status) {
		// 							ret.openId = openId;
		// 							callback(ret, null);
		// 						} else {
		// 							err.getUserInfo = false;
		// 							err.auth = true;
		// 							ret.isInstalled = true;
		// 							callback(null, err);
		// 						}
		// 					});
		// 				} else {
		// 					err.auth = false;
		// 					err.getUserInfo = true;
		// 					ret.isInstalled = true;
		// 					callback(null, err);
		// 				}
		// 			});
		// 		} else {
		// 			ret.isInstalled = false;
		// 			ret.auth = true;
		// 			ret.getUserInfo = true;
		// 			callback(null, ret);
		// 		}
		// 	});
		// }
	};

	Bind.prototype.constructor = Bind;

	module.exports = new Bind();

});
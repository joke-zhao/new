define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('login/index_view'),
        data: {
            show: false,
            phone: "",
            password: ""
        },
        created: function () {
            //!关闭苹果侧滑关闭窗口
            api.setWinAttr({
                slidBackEnabled: false,
            });
            //!防止安卓返回键
            api.addEventListener({ name: "keyback", },
                function (ret, err) {
                    api.toast({
                        msg: "再按一次退出拍账王",
                        duration: 2000,
                        location: "bottom",
                    });
                    api.addEventListener(
                        {
                            name: "keyback",
                        },
                        function (ret, err) {
                            api.closeWidget({
                                silent: false,
                            });
                        }
                    );
                });
        },
        filters: {

        },
        methods: {
            login() {
                if (this.phone === '' || this.password === '') {
                    _g.toast('手机号码和密码都不能为空')
                } else {
                    var url = "api/control/beatUser/userLoginByPhoneAndPassword";
                    var option = {
                        data: {
                            phone: this.phone,
                            passWord: this.password,
                        }
                    }
                    var self = this
                    Http.ajax({
                        url: url,
                        data: option,
                        method: 'post',
                        isSync: true,
                        isJson: true,
                        lock: false,
                        success: function (ret) {
                            if (ret.code === 200) {
                                console.log(ret, "你们好")
                                _g.toast("登录成功啦~");
                                _g.setLS("token", ret.data.token); //存token
                                _g.setLS("userId", ret.data.userInfo.id); //存用户id
                                _g.setLS("roleId", ret.data.roleInfo.id); //存角色id
                                _g.setLS("roleName", ret.data.roleInfo.roleName); //存角色名称
                                _g.setLS("deptId", ret.data.deptId); //存首位公司部门id
                                _g.setLS("companyName", ret.data.companyName); //存首位公司名
                                _g.setLS("companyId", ret.data.companyList.length === 0 ? '0' : ret.data.companyList[0].id);
                                _g.setLS("nickName", ret.data.userInfo.nickname); //存用户昵称
                                _g.setLS("photoUrl", ret.data.userInfo.photoUrl); //存用户头像
                                _g.setLS("userSign",  ret.data.userInfo.sign); //存用户签名
                                _g.setLS("userPhone",  ret.data.userInfo.phone); //存用户手机
                                _g.setLS("introduction",  ret.data.userInfo.introduction); //存服务商个人介绍
                                if (_g.getLS("roleId") == 2) {
                                    self.openWinBoss()
                                } else {
                                    self.openWin()
                                }
                            }
                        }
                    })
                }

            },
            // 纳税人老板、游客端登录
            openWinBoss() {
                _g.openWin({
                        name: "main-indexBoss",
                        url: "../main/indexBoss_win.html",
                        bounces: false,
                        slidBackEnabled: false,
                        animation: { type: "none" },
                    },"normal");
            },
            openWin() {
                _g.openWin(
                    {
                        name: "main-index",
                        url: "../main/index_win.html",
                        bounces: false,
                        slidBackEnabled: false,
                        animation: { type: "none" },
                    },
                    "normal"
                );
            },
            // 打开忘记密码
            openForgetPassword() {
                _g.openWin({
                    header: { title: '忘记密码' },
                    name: "findPassword-index",
                    url: "../findPassword/index_frame.html",
                    bounces: true,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 打开新用户注册
            openRegister() {
                _g.openWin({
                    header: { title: '新用户注册' },
                    name: "register-index",
                    url: "../register/index_frame.html",
                    bounces: true,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 打开隐私协议
            openPrivacy() {
                _g.openWin({
                        header: { title: '隐私保护政策' },
                        name: "index-privacy",
                        url: "../login/privacy_frame.html",
                        bounces: false,
                        slidBackEnabled: false,
                        animation: { type: "none" },
                    });
            },
        }
    });

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {
                // direction: 'horizontal',
                // initialSlide: 0,
                // autoplay: 1000
                // autoplayStopOnLast: true
            });
            // var homeBanner = new Swiper('#banner', {
            //     direction: 'horizontal',
            //     loop: true,
            //     autoplay: 5000,
            //     pagination: '#banner .swiper-pagination',
            //     bulletActiveClass: 'is-active',
            //     autoplayDisableOnInteraction: false,
            //     onSliderMove: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: false
            //         });
            //     },
            //     onTouchEnd: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: true
            //         });
            //     },
            // })
        }
    };

    _page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

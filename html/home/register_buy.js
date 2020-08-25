define(function (require, exports, module) {
    var Http = require('U/http');
    var area = require('U/area')
    var vant = require('L/vant/vant.min.js')
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/register_buy_view'),
        components: {
            vant
        },
        data: {
            payShow: false, //支付弹框
            payList: [
                { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
                { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
            ], //支付方式
            payFlag: 0, //支付方式标志
            totalPrice: 0.01,
            id: '',
            serviceList: [],
            chooseList: [
                {
                    name: '遵守拍账王服务流程',
                    isChecked: false
                },
                {
                    name: '服务协议',
                    isChecked: false
                }
            ],
            areaList: [],
            show: false,
            province: '省',
            city:'市',
            county: '区',
            imgList: [],
            content: '',
            price: 0,
            serviceUserId: ''
        },
        filters: {

        },
        methods:{
            // 点击立即支付 - 调起支付弹窗
            handlePay() {
                // this.totalPrice = this.packageList[this.swiperId].packagePrice * this.companyIdList.length
                //this.totalPrice =  this.price// 测试给1分钱 单位是元 0.01
                // console.log(this.companyIdList, "公司id列表");
                // if (this.companyIdList.length === 0) {
                //     _g.toast("请选择购买公司");
                // } else {
                //     this.payShow = true;
                // }
                this.payShow = true;
            },
            // 选择支付方式
            handlePayType() {
                if (this.payFlag === 0) {
                    _g.toast("请选择支付方式");
                } else if (this.payFlag === 1) {
                    console.log("微信支付");
                    this.getPayInfo(1,this.totalPrice);
                } else {
                    console.log("支付宝支付");
                    this.getPayInfo(2,this.totalPrice);
                }
            },
            // 根据支付方式唤起App
            getPayInfo(payType,totalPrice) {
                var url = "pay/appPay";
                var option = {
                    data: {
                        payStatus:payType,
                        money:totalPrice,//totalPrice
                        status:'购买服务',
                        //_g.getLS('userId')  2c9274f6737ef5ab0173801073db004a
                        userId:_g.getLS('userId'),
                        payNum: this.serviceUserId
                    },
                };
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isJson: true,
                    isSync: false,
                    lock: false,
                    success: function (ret) {
                        console.log(ret, "获取订单信息");
                        if (ret.code === 200) {
                            if(payType === 1){
                                main.wxPay(ret.data)
                            }else{
                                main.aLiPay(ret.data)
                                // main.submitOrder()
                            }
                        }
                    },
                });
            },
            // 支付宝支付
            aLiPay(payData) {
                // this.submitOrder(payData.id) //web测试
                // return false
                var aliPayPlus = api.require("aliPayPlus");
                // alert(payData.pay);
                aliPayPlus.payOrder(
                    {
                        orderInfo: payData.pay,
                    },
                    function (ret, err) {
                        var msg = ret.code;
                        //9000：支付成功
                        if (ret.code === "9000") {
                            msg = "支付成功";
                            // 支付成功 提交订单 传递消费记录id
                            main.submitOrder(payData.id)
                        }
                        //8000：正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
                        if (ret.code === "8000") {
                            msg = "正在处理中...请稍后";
                        }
                        //4000：订单支付失败
                        if (ret.code === "4000") {
                            msg = "订单支付失败";
                        }
                        //5000：重复请求
                        if (ret.code === "5000") {
                            msg = "重复请求";
                        }
                        //6001：用户中途取消支付操作
                        if (ret.code === "6001") {
                            msg = "用户中途取消支付操作";
                        }
                        //6002：网络连接出错
                        if (ret.code === "6002") {
                            msg = "网络连接出错";
                        }
                        //6004：支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
                        if (ret.code === "6004") {
                            msg = "支付结果未知";
                        }
                        api.alert({
                            title: "支付结果",
                            msg: msg,
                            buttons: ["确定"],
                        });
                    }
                );
            },
            // 微信支付
            wxPay(payData) {
                var url = "wxPay/unifiedOrder?"
                    +"amount=" + 1
                    +"&body=" + 'yyyyyy'
                    +"&orderNo=" + '9988'
                var option = {
                    data: {
                        // payStatus:payType,
                        // money:totalPrice,
                        // status:'大家好',
                        // userId:_g.getLS('userId')
                    },
                };
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isJson: true,
                    isSync: false,
                    lock: false,
                    success: function (ret) {
                        console.log(ret, "获取订单信息");
                    },
                });
                var wxPayPlus = api.require("wxPayPlus");
                wxPayPlus.getOrderId(
                    {
                        info:payData
                        // apiKey: payData.pay.appid,
                        // orderId: payData.pay.partnerid,
                        // mchId: payData.pay.partnerid,
                        // nonceStr: payData.pay.nonceStr,
                        // timeStamp: payData.pay.timeStamp,
                        // package: payData.pay.package,
                        // sign: payData.pay.sign,
                    },
                    function (ret, err) {
                        alert(JSON.stringify(ret),'回调')
                        if (ret.status) {
                            //支付成功

                        }
                    }
                );
            },
            // 购买套餐
            submitOrder(eId) {
                console.log({
                    "expenseId": eId,
                    "serverId": this.id,
                    //_g.getLS('userId') 2c9274f6737ef5ab0173801073db004a
                    "takeOrderId": this.serviceUserId,
                    "userId": _g.getLS('userId'),
                })
                Http.ajax({
                    data: {
                        "data": {
                            "expenseId": eId,
                            "serverId": this.id,
                            //this.price  0.01
                            "price": this.price,
                            //_g.getLS('userId') 2c9274f6737ef5ab0173801073db004a
                            "takeOrderId": this.serviceUserId,
                            "userId": _g.getLS('userId')
                        },
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: false,
                    url: "api/control/beatServer/buyBeatServer",
                    success: result => {
                        if (result.code === 200){
                            alert('购买成功')
                        }
                    }
                })
            },
            buy() {
                if (this.price === 0){
                    _g.toast('请选择服务')
                    return
                }
                if (!this.chooseList[0].isChecked ||!this.chooseList[1].isChecked ) {
                    _g.toast('请同意协议')
                    return
                }
                this.payShow = true
                this.totalPrice =  this.price
            },
            cashOut() {
                this.payShow = true
            },
            selectDetail() {
                Http.ajax({
                    data: {
                        "data": {
                            "id": this.id
                        },
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: false,
                    url: "api/control/beatServer/viewBeatServer",
                    success: result => {
                        if (result.code === 200) {
                            console.log(result.data)
                            let data = result.data
                            let imageUrl = data.imageUrl
                            if (imageUrl !== '' || imageUrl.charAt(imageUrl.length-1) === ';'){
                                this.imgList = imageUrl.split(';')
                                this.imgList.splice(this.imgList.length - 1,1)
                            }
                            this.province = data.province
                            this.city = data.city
                            this.county = data.district
                            this.content = data.content
                            this.serviceUserId = data.userId
                            this.serviceList = data.prices.map(item => {
                                return {
                                    typeId: item.typeId,
                                    price: item.price,
                                    isChecked: false
                                }
                            })
                        } else{
                            _g.toast(result.message)
                        }

                    }
                })
            },
            handleCancel() {
                this.show = false;
            },
            handleConfirm(e) {
                this.province = e[0].name;
                this.city = e[1].name;
                this.county= e[2].name;
                this.show = false;
            },
            changeService(index) {
                this.serviceList[index].isChecked = !this.serviceList[index].isChecked
                if (this.serviceList[index].isChecked) {
                    this.price += this.serviceList[index].price
                }else{
                    this.price -= this.serviceList[index].price
                }
            },
            changeChoose(index) {
                this.chooseList[index].isChecked = !this.chooseList[index].isChecked
            }
        },
        mounted() {
            this.areaList = area
            //2c9080817351dae6017351dc23290879  api.pageParam.id
            this.id = api.pageParam.id
            this.selectDetail()
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

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

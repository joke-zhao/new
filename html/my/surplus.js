define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require('L/vant/vant.min.js')
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('my/surplus_view'),
        data: {
            chooseIndex: -1,
            showChoose: false,
            payShow: false, //支付弹框
            payList: [
                { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
                { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
            ], //支付方式
            payFlag: 0, //支付方式标志
            totalPrice: 0,
            user: {},
            balance: 0.01,
            vxPhone: '',
            tax: 0,
            gain: 0,
            inputValue: 0,
            phoneShow: false,
            phoneNum: ''
        },
        components: {
            vant
        },
        created() {
            this.getUser()
        },
        filters: {

        },
        methods:{
            openList() {
                _g.openWin({
                    header: { title: '提现记录' },
                    name: "cash-out",
                    url: "../my/cash_out_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                    } //携参
                })
            },
            updatePhone() {
                console.log(this.phoneNum + '')
                Http.ajax({
                    data: {
                        data: {
                            vxPhone: this.phoneNum + '',
                            //_g.getLS('userId')
                            //4028818b7356d292017356dc06080010,001
                            userId: _g.getLS('userId')
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatUser/updateBinding',
                    success: result => {
                        if (result.code === 200) {
                            _g.toast('绑定成功')
                            this.phoneShow = false
                            this.getUser()
                        }
                    }
                })
            },
            inputChange() {
                if (String(this.inputValue).indexOf('.') !== -1){
                    this.inputValue = Number(this.inputValue).toFixed(0)
                }
                if (this.inputValue !== '' || isNaN(this.inputValue)){
                    if (this.inputValue >= 10) {
                        Http.ajax({
                            data: {
                                data: {
                                    money: this.inputValue,
                                    //_g.getLS('userId')
                                    //4028818b7356d292017356dc06080010,001
                                    userId: _g.getLS('userId')
                                }
                            },
                            isJson: true,
                            method: "post",
                            isSync: true,
                            lock: false,
                            url: 'api/control/beatDeposit/selectBeatDepositTax',
                            success: result => {
                                if (result.code === 200) {
                                    this.tax = result.data
                                }
                                if (result.code === 500) {
                                    this.inputValue = 0
                                }
                            }
                        })
                    }
                }
            },
            getUser() {
                Http.ajax({
                    data: {
                        data: {
                            //_g.getLS('userId')
                            //4028818b7356d292017356dc06080010,001
                            userId: _g.getLS('userId')
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatUser/userInfo',
                    success: result => {
                        if (result.code === 200) {
                            console.log(result.data)
                            this.user = result.data
                            this.vxPhone = result.data.userInfo.vxPhone
                            this.balance = result.data.userInfo.balance === null ? 0 : result.data.userInfo.balance
                        }
                    }
                })
            },
            cashOut() {
                if (this.vxPhone === '') {
                    _g.toast('请先绑定手机号')
                    return
                }
                if (this.inputValue === '' || this.inputValue === 0){
                    _g.toast('请输入金额')
                    return
                }
                if (this.inputValue < 10){
                    _g.toast('请输入金额应不小于10')
                    return
                }
                let postData = {
                    data: {
                        account: this.user.userInfo.vxPhone,
                        price: this.inputValue,
                        serviceCharge: this.tax,
                        createTime: new Date().getTime(),
                        //_g.getLS('userId')
                        //4028818b7356d292017356dc06080010,001
                        userId: _g.getLS('userId'),
                        way: '微信'
                    }
                }
                Http.ajax({
                    data: postData,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatDeposit/createBeatDeposit',
                    success: result => {
                        if (result.code === 200) {
                            _g.toast('提现完成，后台人员处理中')
                            this.getUser()
                            this.inputValue = 0
                            this.tax = 0
                        }
                    }
                })
            },
            handlePayType() {

            },
            changeChoose(index) {
                this.showChoose = true
            }
        }
    });
    (function () {

    })();
    module.exports = {};
});

define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var vant = require("L/vant/vant.min.js");

    var main = new Vue({

        el: '#main',
        template: _g.getTemplate('legwork/legwork_lookfor_view'),
        data: {
           //是否显示底部栏
            isShowBottom:true,
          //0，不刷新，1刷新
            isRefresh:0,
            show:false,
            show1:false,
            isShowDate:false,
            deliverylon:0,
            deliverylat:0,
            deliveryAddress:'请选择',
            pickuplon:0,
            pickuplat:0,
            pickupAddress:'请选择',
            PickupDoorplate:'',//取货门牌号
            DeliveryDoorplate:'',//送货门牌号
            pinch:'',//代跑
            note:'',//备注
            deliveryDate:'立刻前往',
            tempTime:'立刻前往',
            currentTime:'立刻前往',
            address:'',
            sendUserId:'',
            totalPrice:100,
            isPay:false,
            payFlag: 0, //支付方式标志
            payList: [
                { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
                { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
            ],
            docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,   //实时屏幕高度
            hideshow:true,  //显示或者隐藏footer

        },
        filters: {
          formatDate(val) {
              let date = new Date(val).Format('hh:mm')
              return date ;
          },
          //地址过长时截断
          subText(val){
            var str = val;
            if(str.length>13){
              return str.substring(0,13)+'...';
            }
            return val;
          }
        },
        computed:{

        },
        created:function(){
            this.sendUserId = _g.getLS("userId");
            console.log(api.pageParam.id);
            window.fnName = function (data) {
                // _g.alert(data)
                console.log(data.address)
                console.log(data.lon)
                console.log(data.lat)
                console.log(data.id)
                if(data.id==1){
                    main.deliveryAddress = data.address;
                    main.deliverylon = data.lon;
                    main.deliverylat = data.lat;
                }
                if(data.id==0){
                    main.pickupAddress = data.address;
                    main.pickuplon = data.lon;
                    main.pickuplat = data.lat;
                }

            };
        },
        mounted(){
            window.onresize = ()=>{
                return(()=>{
                    this.showHeight = document.body.clientHeight;
                })()
            }
        },
        watch:{
            showHeight:function() {
                if(this.docmHeight > this.showHeight){
                    this.hideshow=false
                }else{
                    this.hideshow=true
                }
            }
        },
        methods: {
          handle(){
            console.log(this.pinch);
            this.pinch = this.pinch.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
            this.pinch = this.pinch.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            this.pinch = this.pinch.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            this.pinch =this.pinch.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
          },
          showBottom(){
            this.isShowBottom = true;
          },
          hideBottom(){
            this.isShowBottom = false;
          },
          //刷新页面的方法
            refresh(){
              this.isRefresh=0,
              this.show=false,
              this.show1=false,
              this.isShowDate=false,
              this.deliverylon=0,
              this.deliverylat=0,
              this.deliveryAddress='请选择',
              this.pickuplon=0,
              this.pickuplat=0,
              this.pickupAddress='请选择',
              this.PickupDoorplate='',//取货门牌号
              this.DeliveryDoorplate='',//送货门牌号
              this.pinch='',//代跑
              this.note='',//备注
              this.deliveryDate='立刻前往',
              this.tempTime='立刻前往',
              this.currentTime='立刻前往',
              this.address='',
              this.totalPrice=100,
              this.isPay=false,
              this.payFlag=0
            },
            handlePay(){
                if(main.PickupDoorplate.length===0||main.DeliveryDoorplate.length===0||main.deliveryAddress.length===3||main.pickupAddress.length===3)
                {
                    _g.toast("请输入正确信息");
                }
                else if(main.pinch<=0){
                    _g.toast("请输入大于0的金额");
                }
                else{  this.isPay = true;}
                console.log(this.sendUserId);
            },// 选择支付方式
            handlePayType() {
                if (this.payFlag === 0) {
                    _g.toast("请选择支付方式");
                } else if (this.payFlag === 1) {
                    console.log("微信支付");
                    this.getPayInfo(1,this.pinch);
                } else {
                    console.log("支付宝支付");
                    this.getPayInfo(2,this.pinch);
                }
            },
            //下单
            send(id,payStatus){
                    var userId = _g.getLS("userId");
                    var str = String(main.deliveryDate);
                    if (str.indexOf('立')>=0)
                        main.deliveryDate = new Date().getTime();
                    Http.ajax({
                        data: {
                            data:{
                                cost: this.pinch,
                                deliveryAddress: main.deliveryAddress+main.DeliveryDoorplate,
                                deliveryDate: main.deliveryDate,
                                deliveryLatitude: main.deliverylat,
                                deliveryLongitude: main.deliverylon,
                                note: main.note,
                                payId: id,
                                payStatus: payStatus,
                                pickupAddress: main.pickupAddress+ main.PickupDoorplate,
                                pickupLatitude: main.pickuplat,
                                pickupLongitude: main.pickuplon,
                                receiveUserId: "",
                                //测试 '2c90808173463ca90173463cb63a0004'
                                //main.sendUserId
                                sendUserId: userId,
                                status: "waitOrder"
                            }
                        },
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: false,
                        lock: false,
                        url: 'api/control/beatRunErrand/send',
                        success: (res) =>{
                            console.log(res);
                            if(res.code==200){
                                main.list = res.data.records;
                                main.currentPage = res.data.current;
                                main.totalPage = res.data.pages;
                                _g.toast('支付成功')
                                main.refresh();
                                _g.openWin({
                                    header:{title:'我的订单'},
                                    name:"legwork-order",
                                    url:"../legwork/legwork_order_frame.html",
                                    bounces:false,
                                    slidBackEnabled:false,
                                    bgColor:'#fff',
                                    pageParam:{} //携参
                                })
                            }
                            else{
                                _g.toast('出错')
                            }

                        }
                    })

            },
            //打开地图legwork-lookfor
            openMap(id){
                _g.openWin({
                    header: { title: '选择地址' },
                    name: "bMap-index",
                    url: "../legwork/index_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',

                    pageParam: {
                        id:id
                    } //携参,0是取货，1是送货
                })
            },
            onCancel(){
                this.isShowDate = false;
            },
            onConfirm(value){
                this.isShowDate = false;
                var date;
                var times;
                times = value.split(':');
                date = new Date();
                date.setHours(times[0]);
                date.setMinutes(times[1]);
                console.log(date);
                var time = date.getTime();
                this.deliveryDate = time;
                this.currentTime = value;
                console.log(this.deliveryDate);

            },
            // 打开送货地址弹出框
            showPopup(e){
                e.preventDefault()
                this.show=!this.show;
                console.log(this.show);

            },
            closePopup(){
                console.log(1)
                this.show=false;
                console.log(this.show);
            },
             // 打开帮人跑页面
             openIndex(){

                _g.openWin({
                    header:{title:'帮人跑'},
                    name:"legwork-index",
                    url:"../legwork/legwork_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
                this.refresh();
            },
            // 打开我的订单页面
            openOrder(){

              _g.openWin({
                  header:{title:'我的订单'},
                  name:"legwork-order",
                  url:"../legwork/legwork_order_frame.html",
                  bounces:false,
                  slidBackEnabled:false,
                  bgColor:'#fff',
                  pageParam:{} //携参
              })
              this.refresh();
            },
            getPayInfo(payType,totalPrice) {
                var userId = _g.getLS("userId");
                console.log(payType+':'+totalPrice);
                console.log(main.sendUserId);
                var url = "pay/appPay";
                var option = {
                    data: {
                        payStatus:payType,
                        money:totalPrice,
                        status:'跑腿下单',
                        payNum:'',
                        //_g.getLS('userId')
                        //main.sendUserId
                        userId:userId
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
                        if (ret.code === 200) {
                          console.log(ret, "获取订单信息");
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
                var aliPayPlus = api.require("aliPayPlus");
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
                            main.send(payData.id,2) //web测试
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
            }
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

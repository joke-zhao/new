define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('myOrder/myOrder_taxPayer_view'),
        data: {
            //是否能支付
            Payable:false,
            //是否显示支付窗口
            isPay:false,
            payFlag:0,//支付方式标志
            payList: [
                { name: "微信", payId: 1, icon: "../../image/set-info/wePay.png" },
                { name: "支付宝", payId: 2, icon: "../../image/set-info/aliPay.png" },
            ],
            currentTab:-1,
            currentId:'',//当前订单id
            //是否显示圆角
            isRound:false,
            islog:false,
            title:[
                {
                    isActive:true
                },
                {
                    isActive:false
                },
                {
                    isActive:false
                }
            ],
            currentPage:1,
            totalPage:1,
            list:[],
            userId:'',
            isLoad:false,

        },
        created() {
            this.userId = _g.getLS('userId');
            if(!Number(_g.getLS('roleId'))>2)
                this.Payable = true;
            this.Payable = true;
            this.getList();
        },
        filters: {
            //拿到图片带有;分割出来然后取第一个
            splitImg(value){
                if(!value)
                    return;
                let imgUrl = String(value);
                let resultUrl = imgUrl.split(';')[0];
                return resultUrl;
            },
            statusTotext(value){
                if(value === 0)
                    return '服务中';
                if(value === 1)
                    return '结束';
            },
            subCompany(value){
                var str = value;
                if(str.length>20)
                    return str.substr(0,20)+'...';
                else{
                    return value;
                }
            },
            subLabel(value){
                if(!value)
                    return '暂无信息';
                var str = value;
                if(str.length>14)
                    return str.substr(0,13)+'...';
                else{
                    return value;
                }
            }
        },
        methods:{
            isConfirm(item){
                console.log(item.serverType);
                console.log(item.serverId);
                console.log(item.serverPrice);
                this.currentType=item.serverType;
                this.currentId=item.id;
                this.currentPay = item.serverPrice;
                this.islog = true;
            },
            confirmPay(){
                Http.ajax({
                    data: {
                        data:{
                            //main.userId
                            id: this.currentId,
                            status:1
                        },
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatServerOrder/updateBeatServerOrder',
                    success: (res) =>{
                        console.log(res);
                        if(res.code === 200){
                            _g.toast("操作成功");
                            this.getList(this.currentTab);
                        }
                        else{
                            _g.toast("服务异常");
                        }

                    }
                })
            },
            isUnderLine(index){
                this.title.forEach(val=>{
                    val.isActive = false
                });
                this.title[index].isActive=true;
                this.currentTab = index-1;
                this.isLoad = false;
                this.getList(this.currentTab);
            },
            getList(currentTab){
                let num = Number(currentTab);
                    if (num === -1) {
                        Http.ajax({
                            data: {
                                data: {
                                    //main.userId
                                    userId: this.userId,
                                },
                                limit: 10,
                                page: this.currentPage,
                            },
                            isFile: false,
                            isJson: true,
                            method: "post",
                            isSync: false,
                            lock: false,
                            url: 'api/control/beatServerOrder/selectBeatServerOrderList',
                            success: (res) => {
                                console.log(res);
                                if (res.code === 200) {
                                    if (this.isLoad === false) {
                                        this.list = res.data.records;
                                        this.currentPage = res.data.current;
                                        this.totalPage = res.data.pages;
                                    } else {
                                        this.list = this.list.concat(res.data.records);
                                        this.currentPage = res.data.current;
                                        this.totalPage = res.data.pages;
                                        this.isLoad = false;
                                    }

                                    console.log('cur' + this.currentPage + ':' + 'total' + this.totalPage);
                                    if (this.list.length != 0)
                                        this.isRound = true;
                                }
                                else {
                                    _g.toast("服务异常");
                                }

                            }
                        })
                    } else {
                        Http.ajax({
                            data: {
                                data: {
                                    //main.userId
                                    userId: this.userId,
                                    status: num
                                },
                                limit: 10,
                                page: this.currentPage,
                            },
                            isFile: false,
                            isJson: true,
                            method: "post",
                            isSync: false,
                            lock: false,
                            url: 'api/control/beatServerOrder/selectBeatServerOrderList',
                            success: (res) => {
                                console.log(res);
                                if (res.code === 200) {
                                    if (this.isLoad === false) {
                                        this.list = res.data.records;
                                        this.currentPage = res.data.current;
                                        this.totalPage = res.data.pages;
                                    } else {
                                        this.list = this.list.concat(res.data.records);
                                        this.currentPage = res.data.current;
                                        this.totalPage = res.data.pages;
                                        this.isLoad = false;
                                    }

                                    console.log('cur' + this.currentPage + ':' + 'total' + this.totalPage);
                                    if (this.list.length != 0)
                                        this.isRound = true;
                                }
                                else {
                                    _g.toast("服务异常");
                                }

                            }
                        })
                    }


            },
            // getOtherList(status){
            //     Http.ajax({
            //         data: {
            //             data:{
            //                 //main.userId
            //                 takeOrderId: this.userId,
            //                 status:status
            //             },
            //             limit: 10,
            //             page: this.currentPage,
            //         },
            //         isFile: false,
            //         isJson: true,
            //         method: "post",
            //         isSync: false,
            //         lock: false,
            //         url: 'api/control/beatServerOrder/selectBeatServerOrderList',
            //         success: (res) =>{
            //             console.log(res);
            //             if(res.code === 200){
            //                 if(this.isLoad === false){
            //                     this.list = res.data.records;
            //                     this.currentPage = res.data.current;
            //                     this.totalPage = res.data.pages;
            //                 }else{
            //                     this.list = this.list.concat(res.data.records);
            //                     this.currentPage = res.data.current;
            //                     this.totalPage = res.data.pages;
            //                     this.isLoad = false;
            //                 }
            //
            //                 console.log('cur'+this.currentPage+':'+'total'+this.totalPage);
            //                 if(this.list.length != 0)
            //                     this.isRound = true;
            //             }
            //             else{
            //                 _g.toast("服务异常");
            //             }
            //
            //         }
            //     })
            // },
            openDetail(id){
                _g.openWin({
                    header:{title:'订单详情'},
                    name:"myOrder-detail",
                    url:"../myOrder/myOrder_detail_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{id:id} //携参
                })
            },
        }
    });
    // 上拉加载更多
    _g.setLoadmore(10,function(){
        if(main.currentPage >= main.totalPage){
            _g.toast('数据已全部加载')
        }else{
            console.log(main.currentPage+':'+main.totalPage);
            main.isLoad=true;
            main.currentPage++;
            if(this.currentTab===0)
                main.getList(-1);
            else{
                main.getList(this.currentTab);
            }
        }
    });

    var _page = {
    };

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

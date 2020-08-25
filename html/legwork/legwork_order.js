define(function (require, exports, module) {

    var Http = require('U/http');

    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('legwork/legwork_order_view'),
        data: {
            //是否上拉
            isAdd:false,
            //当前子栏
            col:0,
            //总页数
            totalPage:1,
            //登录用户id
            userId:'',
            //是否加下划线
            isActive1:true,
            //是否显示待收货，待发货
            isPick:true,
            //是否显示待付款，代收款
            isPay:true,
            //是否显示结束
            isFinished:true,
            //tab一级栏
            tabs_title:[
                {
                    id:1,
                    text:'我发',
                    isActive:true
                },
                {
                    id:2,
                    text:'我接',
                    isActive:false
                }
            ],
            // tabs二级栏
            tabs: [
                {
                    id: 1,
                    isActive: true
                },
                {
                    id: 2,
                    isActive: false
                },
                {
                    id: 3,
                    isActive: false
                },
                {
                    id: 4,
                    isActive: false
                },
            ],
            send:[
                {
                    title:'sendAll',
                    value: false
                },
                {
                    title:'sendAccept',
                    value:false
                },
                {
                    title:'sendPay',
                    value:false
                },
                {
                    title:'sendEnd',
                    value:false
                },
            ],
            delievery:[
                {title:'receiveAll',value:false},
                {title:'receiveSend',value:false},
                {title:'receiveAccept',value:false},
                {title:'receiveEnd',value:false},
            ],
            lat:0,
            lon:0,
            list:[],
            currentPage:1,
        },
        created:function(){
            this.userId = _g.getLS("userId");
            this.showSend(0);
        },
        filters: {
            formatDate(val) {
                let date = new Date(val).Format('hh:mm')
                return date ;
            },
            statusText(val){
                if(main.isActive1===true){
                    if(val==='waitOrder')
                        return '待收货';
                    if(val==='waitConfirm'||val==='underway')
                        return '待付款';
                    if(val==='finished'||val==='closed')
                        return '结束';
                }else{
                    if(val==='underway')
                        return '待发货';
                    if(val==='waitConfirm')
                        return '待收款';
                    if(val==='finished'||val==='closed')
                        return '结束';
                }

            },
            styleChange(val){
                if(val.toString().trim()==='waitOrder')
                    return 'btn-yellow';
                if(val.toString().trim()==='underway')
                    return 'btn-blue';
                if(val.toString().trim()==='finished'||val.toString().trim()==='closed')
                    return 'btn-slive';
                if(val.toString().trim()==='waitConfirm'){
                    if(main.isActive1===false)
                        return 'btn-slive';
                    if(main.isActive1===true)
                        return 'btn-blue';
                }
            },
            subText(val){
                var str = val;
                if(str.length>13){
                    return str.substring(0,13)+'...';
                }
                return val;
            }
        },
        methods: {
            // 打开我接详情
            openDeliDetail(runid){
                _g.openWin({
                    header:{title:'跑腿'},
                    name:"order-receive",
                    url:"../legwork/order_receive_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{runid} //携参
                })
            },
            // 打开我发详情，传订单id过去
            openSendDetail(runid){
                _g.openWin({
                    header:{title:'跑腿'},
                    name:"order-send",
                    url:"../legwork/order_send_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{runid} //携参
                })

            },
            // 打开接单页
            openReceipt(item){
                console.log(item);
                var id = item.id;
                _g.openWin({
                    header:{title:'接单'},
                    name:"index-receipt",
                    url:"../legwork/index_receipt_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{id} //携参
                })
            },
            // 打开帮人跑页面
            openIndex(){
                this.currentPage = 1;
                _g.openWin({
                    header:{title:'帮人跑'},
                    name:"legwork-index",
                    url:"../legwork/legwork_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            },
            // 打开找人跑页面
            openLookfor(){
                this.currentPage = 1;
                _g.openWin({
                    header:{title:'找人跑'},
                    name:"legwork-lookfor",
                    url:"../legwork/legwork_lookfor_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            },
            showSend(index){
                var self = this;
                self.col = index;
                this.tabs.forEach(value => {
                    value.isActive=false;
                });
                this.tabs[index].isActive = true;
                this.send.forEach(obj=>{
                    obj.value = false
                });
                this.delievery.forEach(obj=>{
                    obj.value = false
                });
                this.send[index].value = true;
                Http.ajax({
                    data: {
                        data:{
                            currentLatitude: self.lat,
                            currentLongitude: self.lon,
                            helpOther: false,
                            pageNum: self.currentPage,
                            pageSize: 10,
                            receiveAccept: self.delievery[1].value,
                            receiveAll: self.delievery[0].value,
                            receiveEnd: self.delievery[3].value,
                            receiveSend: self.delievery[2].value,
                            receiveUserId: '',
                            sendAccept: self.send[1].value,
                            sendAll: self.send[0].value,
                            sendEnd: self.send[3].value,
                            sendPay: self.send[2].value,
                            //main.userId
                            userId: self.userId
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatRunErrand/list',
                    success: (res) =>{

                        if(main.isActive1==true&&main.isAdd==true){
                            main.list = main.list.concat(res.data.records)
                            main.isAdd = false;
                        }
                        else{
                          console.log(res);
                            main.list = res.data.records;
                        }

                        main.currentPage = res.data.current;
                        main.totalPage = res.data.pages;
                    }
                })
            },
            showDelievery(index){
                var self = this;
                self.col = index;
                this.tabs.forEach(value => {
                    value.isActive=false;
                });
                this.tabs[index].isActive = true;
                this.send.forEach(obj=>{
                    obj.value = false
                });
                this.delievery.forEach(obj=>{
                    obj.value = false
                });
                this.delievery[index].value = true;
                Http.ajax({
                    data: {
                        data:{
                            currentLatitude: self.lat,
                            currentLongitude: self.lon,
                            helpOther: false,
                            pageNum: self.currentPage,
                            pageSize: 10,
                            receiveAccept: self.delievery[2].value,
                            receiveAll: self.delievery[0].value,
                            receiveEnd: self.delievery[3].value,
                            receiveSend: self.delievery[1].value,
                            receiveUserId: '',
                            sendAccept: self.send[1].value,
                            sendAll: self.send[0].value,
                            sendEnd: self.send[3].value,
                            sendPay: self.send[2].value,
                            //main.userId
                            userId: self.userId
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatRunErrand/list',
                    success: (res) =>{
                        console.log(res);
                        if(main.isActive1==false&&main.isAdd==true){
                            main.list = main.list.concat(res.data.records);
                            main.isAdd = false;
                        }
                        else{
                            main.list = res.data.records;
                        }

                        main.currentPage = res.data.current;
                        main.totalPage = res.data.pages;
                    }
                })
            },
            toggleTabTitle(index){
                this.tabs_title.forEach(v=>{
                    v.isActive=false
                })
                this.tabs_title[index].isActive=true;
                if(index === 0){
                    this.currentPage = 1;
                    this.showSend(0);
                    this.isActive1 = true;
                }

                if(index=== 1){
                    this.currentPage = 1;
                    this.showDelievery(0);
                    this.isActive1 = false;
                }
                this.col = 0;
                console.log(this.isActive1);
                console.log(index);
            }
            // 切换状态栏
            // toggleTab(index) {
            //     this.tabs.forEach(v => {
            //         v.isActive = false
            //     })
            //     this.tabs[index].isActive = true
            // },
            // // 打开帮人跑页面
            // openIndex(){
            //     _g.openWin({
            //         header:{title:'找人跑'},
            //         name:"legwork-index",
            //         url:"../legwork/legwork_index_frame.html",
            //         bounces:false,
            //         slidBackEnabled:false,
            //         bgColor:'#fff',
            //         pageParam:{} //携参
            //     })
            // },
            // // 打开找人跑页面
            // openLookfor(){
            //     _g.openWin({
            //         header:{title:'我的订单'},
            //         name:"legwork-lookfor",
            //         url:"../legwork/legwork_lookfor_frame.html",
            //         bounces:false,
            //         slidBackEnabled:false,
            //         bgColor:'#fff',
            //         pageParam:{} //携参
            //     })
            // }
        }
    });
    // 上拉加载更多
    _g.setLoadmore(10,function(){
        if(main.currentPage >= main.totalPages){
            _g.toast('数据已全部加载')
        }else{
            main.isAdd=true;
            main.currentPage++;
            if(main.isActive1===true)
                main.showSend(main.col);
            else{
                main.showDelievery(main.col);
            }
        }
    });
    _g.setPullDownRefresh(function () {
        main.currentPage = 1
        main.isAdd=false;
        if(main.isActive1===true)
            main.showSend(main.col);
        else{
            main.showDelievery(main.col);
        }
    });

    var _page = {};

    (function () {

    })();
    module.exports = {};
});

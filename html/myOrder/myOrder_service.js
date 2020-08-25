define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('myOrder/myOrder_service_view'),
        data: {
            //是否显示圆角
            isRound:false,
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
            userId:''
        },
        created() {
            this.userId = _g.getLS('userId');
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
                var str = value;
                if(str.length>14)
                    return str.substr(0,13)+'...';
                else{
                    return value;
                }
            }
        },
        methods:{
            isUnderLine(index){
                this.title.forEach(val=>{
                    val.isActive = false
                });
                this.title[index].isActive=true;
            },
            getList(){
                Http.ajax({
                    data: {
                        data:{
                            //main.userId
                            takeOrderId: this.userId
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
                    success: (res) =>{
                        console.log(res);
                        if(res.code === 200){
                            this.list = res.data.records;
                            this.currentPage = res.data.current;
                            this.totalPage = res.data.pages;
                            if(this.list.length != 0)
                                this.isRound = true;
                        }
                        else{
                            _g.toast("服务异常");
                        }

                    }
                })
            },
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
            }
        }
    });
    // 上拉加载更多
    _g.setLoadmore(10,function(){
        if(main.currentPage >= main.totalPages){
            _g.toast('数据已全部加载')
        }else{
            main.currentPage++;
            main.getList();
        }
    });

    var _page = {
    };

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

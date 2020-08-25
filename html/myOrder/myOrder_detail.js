define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('myOrder/myOrder_detail_view'),
        data: {
            id:'',
            obj:{},
            prices:[],
            label:''
        },
        created() {
            this.id = api.pageParam.id;
            this.getInfo();
        },
        filters: {

        },
        computed:{
            sum() {
                let sum=0;
                if(this.prices){
                    this.prices.forEach(value=>{
                        sum += value.price;
                    });
                    return sum;
                }else{
                    return '无';
                }
            }
        },
        methods:{
            getInfo(){
                Http.ajax({
                    data: {
                        data:{
                            //main.id
                            id: this.id,
                        },
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: 'api/control/beatServer/viewBeatServer',
                    success: (res) => {
                        console.log(res);
                        if(res.code === 200){
                            this.getServerType(res.data.serverTypeId);
                            this.obj = res.data;
                            if(res.data.prices)
                                this.prices = res.data.prices;
                            else{
                                this.prices.push({'id':'','typeId':'暂无信息','areaId':'暂无信息','price':'暂无信息','status':null})
                            }
                        }
                        else{
                            _g.toast("服务异常");
                        }

                    }
                })
            },
            getServerType(typeId){
                Http.ajax({
                    data: {
                        data:{
                            //main.id
                            id: typeId,
                        },
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: 'api/control/beatServerType/selectBeatServerType',
                    success: (res) => {
                        console.log(res);
                        if(res.code === 200){
                            if(res.data)
                                if(res.data.name)
                                    this.label = res.data.name;
                                else{
                                    this.label = '暂无信息';
                                }
                            else{
                                this.label = '暂无信息';
                            }
                            console.log(this.label);
                        }
                        else{
                            _g.toast("服务异常");
                        }

                    }
                })
            }
        }
    });


    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

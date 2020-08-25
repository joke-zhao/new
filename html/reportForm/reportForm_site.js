define(function (require, exports, module) {
    var Http = require("U/http");
    var swiper = require("L/swiper/swiper.min.js");
    var vant = require("L/vant/vant.min.js");


    var main = new Vue({
        el: "#main",
        components: {vant},
        template: _g.getTemplate("reportForm/reportForm_site_view"),
        data:{
            minDate: new Date(1978, 0, 1),
            isShow:true,
            columns:['CNY','USD','EUR','GBP','RMB'],
            value: '',
            companyName:'',
            showPicker: false,
            //new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDay()
            startDate: new Date().getFullYear() + '-01',
            //new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDay(),
            endDate: new Date().getFullYear() + '-12',
            show: false,
            list:[],
            printList:[],
            resultSum:{},
            showShare: false,
            options: [
                { name: "图片", icon: "../../image/icon/image.png" },
                { name: "表格", icon: "../../image/icon/biao.png" },
                // { name: "pdf", icon: "../../image/icon/pdf.png" },
            ]
        },
        created:function(){

            this.setChart();
            this.deptId = _g.getLS("deptId");
            this.companyName = _g.getLS("companyName");
        },
        mounted:function(){

        },
        methods:{
            convertToDate(date){
                var date = new Date(date);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                return MM ;
            },
            onConfirm(value) {
                this.value = value;
                this.showPicker = false;
            },
            formatDate(date) {
                if(date.getMonth()+1<10)
                    return `${date.getFullYear()}-0${date.getMonth() + 1}`;
                else{
                    return `${date.getFullYear()}-${date.getMonth() + 1}`;
                }
            },
            onConfirmDate(date) {
                const [start, end] = date;
                this.show = false;
                this.startDate = `${this.formatDate(start)}`;
                this.endDate = `${this.formatDate(end)}`;
                console.log(this.startDate);
                console.log(this.endDate);
                if (this.endDate.substring(0, 4) == this.startDate.substring(0, 4) && parseInt(this.startDate.substring(5, 7)) < parseInt(this.endDate.substring(5, 7))) {
                    this.show = false;
                    this.setChart();
                } else if(this.endDate.substring(0, 4) != this.startDate.substring(0, 4)){
                    console.log(1111);
                    this.show = false;
                    _g.toast("不能跨年查询，请重新选择");
                    this.startDate = new Date().getFullYear() + '-01';
                    this.endDate = new Date().getFullYear() + '-12';
                }
            },
            setChart(){
                var self = this;
                var url = "api/control/erpbusinessData/businessSite?deptName="+this.companyName+"&startDate="+this.startDate +"&endDate="+this.endDate;
                Http.ajax({
                    data: {
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: (res) =>{
                        console.log(res);
                        if(!res.data.SumList){
                            _g.toast("该范围没有数据");
                            this.resultSum.qtySum = '';
                            this.resultSum.upSum = '';
                            this.resultSum.px = '';
                            return;
                        }

                        let list = res.data.resultList;
                        list = list.map(item => {
                            return {
                                ...item,
                                date: this.convertToDate(item.payDd)
                            }
                        })
                        console.log(res.data);
                        self.resultSum = res.data.SumList;
                        self.list = list;
                        var items=[]
                        var up = []
                        var qty = []
                        for(var obj in list){
                            console.log(list[obj]);
                            items.push(list[obj].date);
                            up.push(list[obj].up/10000);
                            qty.push(list[obj].qty);
                        }
                        var xAxisData =  ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
                        var month = [];
                        var sMonth = parseInt(self.startDate.substring(5, 7));
                        var eMonth = parseInt(self.endDate.substring(5, 7));
                        for (var i = sMonth; i < eMonth + 1; i++) {
                            month.push(i + "月");
                        }
                        xAxisData = month;
                        var endPercent = (6 / xAxisData.length) * 100;
                        var option = {
                            tooltip: {
                                trigger: 'axis',
                                position: ['16%', '0%']
                            },
                            grid: {
                                left: '8.5%',
                                // right: '4%',
                                bottom: '15%',
                                containLabel: true
                            },
                            title: {

                            },
                            series: [{
                                name: '租金',
                                type: 'line',
                                data: up,
                                yAxisIndex:0
                            },
                                {
                                    name: '面积',
                                    type: 'line',
                                    data: qty,
                                    yAxisIndex:1
                                }],
                            legend: {
                                icon: 'rect',
                                x: 'center',
                                y: 'bottom',
                                data:[{
                                    name:'租金',
                                    icon:'rect'
                                },{
                                    name:'面积',
                                    icon:'rect'
                                }]
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: xAxisData,
                            },
                            yAxis: [
                                {
                                    type:'value',
                                    name: '单位：万元',
                                    nameTextStyle:{
                                        color:'#24A9DE'
                                    }
                                },
                                {
                                    type:'value',
                                    name:'单位：平方米',
                                    nameTextStyle:{
                                        color:'#99E187'
                                    }
                                }
                            ],
                            dataZoom: [//给x轴设置滚动条
                                {
                                    start: 0,//默认为0
                                    end: endPercent,
                                    type: 'slider',
                                    show: false,
                                    xAxisIndex: [0],
                                    handleSize: 0,//滑动条的 左右2个滑动条的大小
                                    height: 0,//组件高度
                                    left: 50, //左边的距离
                                    right: 40,//右边的距离
                                    bottom: 26,//右边的距离
                                    handleColor: '#ddd',//h滑动图标的颜色
                                    handleStyle: {
                                        borderColor: "#cacaca",
                                        borderWidth: "1",
                                        shadowBlur: 2,
                                        background: "#ddd",
                                        shadowColor: "#ddd",
                                    },
                                    fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                        //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                                        //给第一个设置0，第四个设置1，就是垂直渐变
                                        offset: 0,
                                        color: '#1eb5e5'
                                    }, {
                                        offset: 1,
                                        color: '#5ccbb1'
                                    }]),
                                    backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
                                    showDataShadow: false,//是否显示数据阴影 默认auto
                                    showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                                    handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                                    filterMode: 'filter'
                                },
                                // 下面这个属性是里面拖到
                                {
                                    type: 'inside',
                                    show: true,
                                    xAxisIndex: [0],
                                    start: 0,//默认为1
                                    end: 50
                                },
                            ],
                            color: ["#24A9DE", "#99E187"],

                        };
                        console.log(document.getElementById('myChart'));
                        main.$nextTick(function () {
                            var myChart = echarts.init(document.getElementById("myChart"));
                            myChart.setOption(option);
                        })

                    }
                })
            },
            handlPrint() {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (
                    bIsIpad ||
                    bIsIphoneOs ||
                    bIsMidp ||
                    bIsUc7 ||
                    bIsUc ||
                    bIsAndroid ||
                    bIsCE ||
                    bIsWM
                ) {
                    this.getImg()
                } else {
                    this.print()
                }
            },
            // 打印
            print() {
                //获取打印内容最外层dom节点
                var bdHtml = document.getElementById("table1").innerHTML; //打印内容赋值innerHTML绘制新页面（window.print()打印当前页)
                console.log(bdHtml, "ajajajja");
                // return false
                window.document.body.innerHTML = bdHtml; //调用浏览器打印机
                window.print(); //刷新页面返回当前页
                location.reload();
            },
            onSelect(option) {
                // vant.toast(option.name);
                if (option.name == "图片") {
                    this.getImg();
                    this.showShare = false;
                }
                if (option.name == "表格") {
                    this.exportExcel();
                    this.showShare = false;
                }
            },
            //!导出Excel
            exportExcel() {
                main.printList = main.list;
                if(main.resultSum){
                    var sum ={
                        date:'合计',
                        qty:main.resultSum.qtySum,
                        up:main.resultSum.upSum,
                        amt:main.resultSum.px
                    };
                    main.printList.push(sum);
                }

                var url = "api/control/exportErp/exportExcel";
                var option = {
                    data: {
                        createHeader: true,
                        tableName:'场地表',
                        title:main.value +'~'+ _g.getLS('companyName') + '~场地表',
                        list: main.printList,
                        sheetName: "表格1",
                        fileName: "excelForm",
                    },
                };
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if(ret.code === 200){
                            _g.toast(ret.message)
                            window.location.href = ret.data
                        }
                    },
                });
            },
            getImg() {
                htmltoImage.init(
                    {
                        el: document.getElementById("table1"),
                        isImageObject: true,
                    },
                    function (res, err) {
                        if (res) {
                            var base64Str1 = htmltoImage.cutprefixBase64(res.base64str);
                            var trans = api.require("trans");
                            trans.saveImage(
                                {
                                    base64Str: base64Str1,
                                    album: true,
                                    imgName: new Date().getTime() + ".png",
                                },
                                function (ret, err) {
                                    if (ret.status) {
                                        _g.toast(JSON.stringify(ret));
                                    } else {
                                        _g.toast(JSON.stringify(err));
                                    }
                                }
                            );
                        } else {
                            _g.toast(JSON.stringify(err));
                        }
                    }
                );
            }

        },
        filters:{
            subMoney(num){
                if(typeof(num)!=='number')
                    return num;
                //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
                num = String(num);
                num = num.toString().replace(/\$|\,/g,'');
                //如果num不是数字，则将num置0，并返回
                if(''==num || isNaN(num)){return 'Not a Number ! ';}
                //如果num是负数，则获取她的符号
                var sign = num.indexOf("-")> 0 ? '-' : '';
                //如果存在小数点，则获取数字的小数部分
                var cents = num.indexOf(".")> 0 ? num.substr(num.indexOf(".")) : '';
                cents = cents.length>1 ? cents : '' ;//注意：这里如果是使用change方法不断的调用，小数是输入不了的
                //获取数字的整数数部分
                num = num.indexOf(".")>0 ? num.substring(0,(num.indexOf("."))) : num ;
                //如果没有小数点，整数部分不能以0开头
                if('' == cents){ if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
                //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
                else{if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
                //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
                /*
                  也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
                  字符串长度为0/1/2/3时都不用添加
                  字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
                 */
                for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
                {
                    num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
                }
                //将数据（符号、整数部分、小数部分）整体组合返回
                return (sign + num + cents);
            },
            resetMonth(value){
                var newvalue;
                var index = value.indexOf("0");
                switch(index){
                    case 0:
                        newvalue=value.slice(1)+'月';
                        break;
                    default:
                        newvalue=value+'月';
                        break;
                }
                return newvalue;


            }
        }
    });
    //_page.initSwiper();
    (function () {})();
    module.exports = {};
});

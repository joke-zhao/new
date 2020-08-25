define(function (require, exports, module) {
    var Http = require("U/http");

    var vant = require("L/vant/vant.min.js");
    // var element = require("L/element/element.min.js");

    var main = new Vue({

        el: "#main",
        components: {vant},
        template: _g.getTemplate("reportForm/sellForm_index_view"),
        data: {
            //公司名
            deptId: '',
            companyName: "",
            dialogShow: false,
            date1: '',
            date2: '',
            date3: '',
            tableData: [],
            incomeMonthList: [],
            incomeYearList: [],
            incomeYearList2: [],
            depNames: [],
            tLastSum: 0,
            tYingSum: 0,
            tYiSum: 0,
            tSum: 0,
            //[期末余额数组]
            objNames: [],
            //以下是选择日期插件
            //改
            startTime: new Date().getFullYear() + '-01',
            endTime: new Date().getFullYear() + '-12',
            // startTime: '2018-01',
            // endTime: '2018-12',
            minDate: new Date(2000, 0, 1),
            maxDate: new Date(2099, 10, 1),
            currentDate: new Date(),
            value: new Date().getFullYear() + '-12',
            start: '2017-12',
            endValue: '2017-12',
            showPicker: false,
            showPicker1: false,
            showPicker2: false,
            yearMinDate: new Date(2010, 0, 1),
            yearMaxDate: new Date(2030, 11, 1),
            //  ---点击显示表格
            isShow: true,
            //    数量数组
            qtyNames: [],
            showShare: false,
            options: [
                { name: "图片", icon: "../../image/icon/image.png" },
                { name: "表格", icon: "../../image/icon/biao.png" },
                // { name: "pdf", icon: "../../image/icon/pdf.png" },
            ],
        },
        created: function () {
               //改
            this.deptId = _g.getLS("deptId");
            // this.companyName = '广州从化精密钣金制造有限公司';
            this.companyName = _g.getLS("companyName");
            this.selectAmtIncomeByMonth();
            this.selectAmtIncomeByYear();
            this.selectQtyIncomeByYear();
        },
        mounted() {

        },
        filters: {},
        methods: {
            //根据单个年月查询
            selectAmtIncomeByMonth() {
                var self = this;
                //改 ?deptName=" + this.companyName + "&date=" + this.value
                var url = "api/control/erpbusinessData/businessSell";
                var option = {
                    data: {
                        deptName:self.companyName,
                        date:self.value
                    }
                }
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        let incomeList = ret.data.data
                        self.incomeMonthList = incomeList;
                        console.log(incomeList,"月表格");
                        for (let i = 0; i < incomeList.length; i++) {
                            incomeList[i].qty = (incomeList[i].qty || 0)
                                .toFixed(2)
                                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
                            incomeList[i].amt = (incomeList[i].amt / 10000.0 || 0)
                                .toFixed(2)
                                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                        }
                    },
                    error: function (err) {
                        console.log("错误" + err)
                    },
                })
            },
//根据起始 结束 年月查询    金额
            selectAmtIncomeByYear() {
                var self = this;
                //改
                var url = "api/control/erpbusinessData/businessSellGroup?deptName=" + this.companyName + "&startDate=" + this.startTime + "&endDate=" + this.endTime + "&chose='AMT'";
                // var option = {
                //     data: {
                //         deptName: "账王（广州）云科技有限公司",
                //         cur: "",
                //         date: "2017-12"
                //     },
                // };
                self.incomeYearList = [];
                self.objNames = [];
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: false,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        //获取到12个月的数据
                        let incomeLists = ret.data.data;
                        self.incomeYearList = incomeLists;
                        console.log(incomeLists);
                        //存放产品名称
                        const set = new Set();
                        for (var incomeList of incomeLists) {
                            for (var i of incomeList) {
                                set.add(i.prdName);
                            }
                        }
                        //{'产品名称':[数量]}
                        for (var name of set) {
                            let sum = [];
                            var qtyList = []
                            var n = 0;
                            for (var incomeList of incomeLists) {
                                for (var i of incomeList) {
                                    //金额对象数组
                                    if (i.prdName == name) {
                                        i.amt = (i.amt / 10000.0 || 0)
                                            .toFixed(2)
                                            .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
                                        sum[n] = i.amt;
                                        self.objNames[name] = sum;
                                        break;
                                    } else {
                                        sum[n] = 0;
                                        self.objNames[name] = sum;
                                    }
                                }
                                n++;
                            }

                        }
                        self.depNames = set;
                        //series=金额  series2=数量图表
                        var series = [];
                        if (self.objNames.length > 5) {
                            for (var i = 0; i < 5; i++) {
                                for (var obj in self.objNames) {
                                    self.objNames[obj] = self.objNames[obj].map(item => {
                                        return item.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                    })
                                    series.push({
                                        name: obj,
                                        type: 'line',
                                        // stack: '总量',
                                        data: self.objNames[obj],
                                        smooth: true,
                                    })
                                }
                            }
                        } else {
                            for (var obj in self.objNames) {
                                series.push({
                                    name: obj,
                                    type: 'line',
                                    // stack: '总量',
                                    data: self.objNames[obj],
                                    smooth: true,
                                })
                            }
                        }

                        var xAxisData = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
                        var month = [];
                        var sMonth = parseInt(self.startTime.substring(5, 7));
                        var eMonth = parseInt(self.endTime.substring(5, 7));
                        for (var i = sMonth; i < eMonth + 1; i++) {
                            month.push(i + "月");
                        }
                        xAxisData = month;
                        var endPercent = (6 / xAxisData.length) * 100;
                        //金额图表
                        var option = {
                            // title: {
                            //     text: '应收账款'
                            // },
                            tooltip: {
                                trigger: 'axis',
                                position: ['16%', '0%']
                            },
                            legend: {
                                icon: 'rect',
                                x: 'center',
                                y: 'bottom',
                                itemHeight: 10,
                                itemWidth: 10,
                                data: Array.from(set),
                                width: "80%"
                            },
                            grid: {
                                left: '8.5%',
                                right: '3%',
                                bottom: '20%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: xAxisData,
                            },
                            yAxis: {
                                name: '单位：万元',
                                type: 'value',
                            },
                            //   X轴设置滚动条
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
                            color: ["#24A9DE", "#99E187", "#403EEE", "#AD6FFE", "#800000"],

                        };
                        console.log(option, "金额");
                        var myChart = echarts.init(document.getElementById("myChart")); // 指定图表的配置项和数据
                        if (series.length == 0) {
                            _g.toast("该范围没有数据")
                            myChart.setOption(option, true);
                            myChart.clear();
                            myChart.setOption(option, true);
                        } else {
                            option.series = series.filter((item, index) => {
                                return index < 5;
                            });
                            myChart.setOption(option, true);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },
            //根据起始 结束 年月查询    数量
            selectQtyIncomeByYear() {
                var self = this;
                //改  +this.startTime+"&endDate="+ this.endTime;
                var url = "api/control/erpbusinessData/businessSellGroup?deptName=" + this.companyName + "&startDate=" + this.startTime + "&endDate=" + this.endTime + "&chose='QTY'";
                self.incomeYearList2 = [];
                self.qtyNames = [];
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: false,
                    method: "post",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        //获取到12个月的数据
                        let incomeLists = ret.data.data;
                        self.incomeYearList2 = incomeLists;
                        console.log(incomeLists);
                        //存放产品名称
                        const set = new Set();
                        for (var incomeList of incomeLists) {
                            for (var i of incomeList) {
                                set.add(i.prdName);
                            }
                        }
                        //{'产品名称':[数量]}
                        for (var name of set) {
                            var qtyList = []
                            var n = 0;
                            for (var incomeList of incomeLists) {
                                for (var i of incomeList) {
                                    //    数量对象数组
                                    if (i.prdName == name) {
                                        i.qty = i.qty
                                            .toFixed(2)
                                        // .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
                                        qtyList[n] = i.qty;
                                        self.qtyNames[name] = qtyList;
                                        break;
                                    } else {
                                        qtyList[n] = 0;
                                        self.qtyNames[name] = qtyList;
                                    }
                                }
                                n++;
                            }
                        }
                        // self.depNames = set;
                        //series=金额  series2=数量图表
                        var series = [];
                        // console.log(self.qtyNames, '数量');
                        if (self.qtyNames.length > 5) {
                            for (var i = 0; i < 5; i++) {
                                for (var obj in self.qtyNames) {
                                    self.qtyNames[obj] = self.qtyNames[obj].map(item => {
                                        return item.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                    })
                                    series.push({
                                        name: obj,
                                        type: 'line',
                                        // stack: '总量',
                                        data: self.qtyNames[obj],
                                        smooth: true,
                                    })
                                }
                            }
                        } else {
                            for (var obj in self.qtyNames) {
                                series.push({
                                    name: obj,
                                    type: 'line',
                                    // stack: '总量',
                                    data: self.qtyNames[obj],
                                    smooth: true,
                                })
                            }
                        }

                        var xAxisData = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
                        var month = [];
                        var sMonth = parseInt(self.startTime.substring(5, 7));
                        var eMonth = parseInt(self.endTime.substring(5, 7));
                        for (var i = sMonth; i < eMonth + 1; i++) {
                            month.push(i + "月");
                        }
                        xAxisData = month;
                        var endPercent = (6 / xAxisData.length) * 100;
                        //数量图表
                        var option = {
                            // title: {
                            //     text: '应收账款'
                            // },
                            tooltip: {
                                trigger: 'axis',
                                position: ['16%', '0%']
                            },
                            legend: {
                                icon: 'rect',
                                x: 'center',
                                y: 'bottom',
                                itemHeight: 10,
                                itemWidth: 10,
                                data: Array.from(set),
                                width: "80%"
                            },
                            grid: {
                                left: '8.5%',
                                right: '3%',
                                bottom: '20%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: xAxisData,
                            },
                            yAxis: {
                                name: '单位：PCS',
                                type: 'value',
                            },
                            //   X轴设置滚动条
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
                            color: ["#24A9DE", "#99E187", "#403EEE", "#AD6FFE", "#800000"],

                        };
                        console.log(option, '数量');
                        var myChart2 = echarts.init(document.getElementById("myChart2")); // 指定图表的配置项和数据
                        if (series.length == 0) {
                            _g.toast("该范围没有数据")
                            myChart2.setOption(option, true);
                            myChart2.clear();
                            myChart2.setOption(option, true);
                        } else {
                            option.series = series.filter((item, index) => {
                                return index < 5;
                            });
                            myChart2.setOption(option, true);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },
            formatter(type, val) {
                if (type === 'year') {
                    return val + '年';
                } else if (type === 'month') {
                    return val + '月';
                }
                return val;
            },
            onConfirm(time) {
                if ((time.getMonth() + 1) < 10) {
                    this.value = time.getFullYear() + '-0' + (time.getMonth() + 1);
                } else {
                    this.value = time.getFullYear() + '-' + (time.getMonth() + 1);
                }
                this.showPicker = false;
                this.selectAmtIncomeByMonth();
                //表格时间
                this.endTime=this.value
                this.selectAmtIncomeByYear()
            },
            onStart(time) {
                if ((time.getMonth() + 1) < 10) {
                    this.startTime = time.getFullYear() + '-0' + (time.getMonth() + 1);
                } else {
                    this.startTime = time.getFullYear() + '-' + (time.getMonth() + 1);
                }
                //约束不能跨年
                if (this.endTime.substring(0, 4) == this.startTime.substring(0, 4) && parseInt(this.startTime.substring(5, 7)) < parseInt(this.endTime.substring(5, 7))) {
                    this.selectAmtIncomeByYear()
                    this.selectQtyIncomeByYear()
                    this.showPicker1 = false
                    this.showPicker2 = true
                } else {
                    this.showPicker1 = false;
                }
            },
            onEnd(time) {
                if ((time.getMonth() + 1) < 10) {
                    this.endTime = time.getFullYear() + '-0' + (time.getMonth() + 1);
                } else {
                    this.endTime = time.getFullYear() + '-' + (time.getMonth() + 1);
                }
                //约束不能跨年
                if (this.endTime.substring(0, 4) != this.startTime.substring(0, 4)) {
                    _g.toast("不能跨年查询，请重新选择")
                }
                //约束不能比起始日期小
                else if (parseInt(this.endTime.substring(5, 7)) < parseInt(this.startTime.substring(5, 7))) {
                    _g.toast("结束月份不能比起始月份小，请重新选择")
                } else {
                    this.showPicker2 = false;
                    this.selectAmtIncomeByYear();
                    this.selectQtyIncomeByYear();
                }
            },
            // 点击打印
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
            // pc打印
            print() {
                //获取打印内容最外层dom节点
                var bdHtml = document.getElementById("table").innerHTML; //打印内容赋值innerHTML绘制新页面（window.print()打印当前页)
                console.log(bdHtml, "ajajajja");
                // return false
                window.document.body.innerHTML = bdHtml; //调用浏览器打印机
                window.print(); //刷新页面返回当前页
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
            // app图片
            getImg() {
                htmltoImage.init(
                    {
                        el: document.getElementById("table"),
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
            },
            //!导出Excel
            exportExcel() {
                //console.log(this.palList,'仅仅是计算机')
                if(this.incomeMonthList.length === 0){
                    _g.toast('表格暂无数据')
                }else{
                    console.log(this.incomeMonthList,'incomeMonthList数据')
                    var url = "api/control/exportErp/exportExcel";
                    var option = {
                        data: {
                            createHeader: true,
                            tableName:'销售表',
                            title:main.value +'~'+ main.companyName + '~销售表',
                            list: this.incomeMonthList,
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
                            if(ret.code ===200){
                                _g.toast(ret.message)
                                window.location.href = ret.data
                            }else{
                                _g.toast(ret.message)
                            }
                        },
                    });
                }

            },
        },
    });

    //   Vue.use(vant.Lazyload);
    var _page = {
        initSwiper: function () {
            var swiper = new Swiper(".swiper-container", {
                // direction: 'horizontal',
                // initialSlide: 0,
                // autoplay: 1000
                // autoplayStopOnLast: true
            });
        },
    };

    //_page.initSwiper();
    (function () {
    })();
    module.exports = {};
});

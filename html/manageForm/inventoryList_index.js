define(function (require, exports, module) {
    var Http = require("U/http");
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: "#main",
        components: { vant },
        template: _g.getTemplate("manageForm/inventoryList_index_view"),
        data: {
            showShare: false,
            options: [
                { name: "图片", icon: "../../image/icon/image.png" },
                { name: "表格", icon: "../../image/icon/biao.png" },
                // { name: "pdf", icon: "../../image/icon/pdf.png" },
            ],
            companyName: "",
            deptId: "",
            showPicker1: false,
            showPicker2: false,
            startTime: new Date().getFullYear() + "-01",
            endTime: new Date().getFullYear() + "-12",
            yearMinDate: new Date(2010, 0, 1),
            yearMaxDate: new Date(2030, 11, 1),

            minDate: new Date(2010, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),

            value: "",
            showPicker: false,

            X1: [],
            X2: [],
            X3: [],
            X4: [],
            X5: [],


            palList: [], //表数据
            initList: [], //原始数据 生成excil使用
            isShow: false,
            isShowImg: true,
            moreImg: "../../image/manageForm/arrow.png",
            packUpMore: "../../image/manageForm/arrow2.png",
        },
        created: function () {
            this.deptId = _g.getLS("deptId");
            this.companyName = _g.getLS("companyName");
            if (new Date().getMonth() + 1 < 10) {
                this.value =
                    new Date().getFullYear() + "-0" + (new Date().getMonth() + 1);
            } else {
                this.value =
                    new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
            }
            //图表一年数据
            this.queryThisYear();
            //查询时间段的数据
            this.queryPAL();
        },
        mounted() { },
        filters: {},
        methods: {
            //开始时间确认
            onPicker1(time) {
                console.log(1 + "按时间区间查询");
                if (time.getMonth() + 1 < 10) {
                    this.startTime = time.getFullYear() + "-0" + (time.getMonth() + 1);
                } else {
                    this.startTime = time.getFullYear() + "-" + (time.getMonth() + 1);
                }
                if (
                    this.startTime.substring(0, 4) === this.endTime.substring(0, 4) &&
                    this.startTime.substring(5, 7) <= this.startTime.substring(5, 7)
                ) {
                    this.queryThisYear();
                    this.queryPAL();
                }
                this.showPicker1 = false;
            },
            //结束时间确认
            onPicker2(time) {
                if (time.getMonth() + 1 < 10) {
                    this.endTime = time.getFullYear() + "-0" + (time.getMonth() + 1);
                } else {
                    this.endTime = time.getFullYear() + "-" + (time.getMonth() + 1);
                }
                //约束不能跨年
                if (this.endTime.substring(0, 4) != this.startTime.substring(0, 4)) {
                    this.showPicker2 = false;
                    _g.toast(
                        this.startTime + "," + this.endTime + "不能跨年查询，请重新选择"
                    );
                }
                //约束不能比起始日期小
                else if (
                    parseInt(this.endTime.substring(5, 7)) <
                    parseInt(this.startTime.substring(5, 7))
                ) {
                    _g.toast("结束月份不能比起始月份小，请重新选择");
                } else {
                    this.showPicker2 = false;
                    //console.log(this.endTime);
                    this.queryThisYear();
                    this.queryPAL();
                }
            },
            formatter(type, val) {
                if (type === "year") {
                    return val + '年';
                } else if (type === "month") {
                    return val + `月`;
                }
                return val;
            },
            Show() {
                this.isShow = !this.isShow;
                this.isShowImg = !this.isShowImg;
            },
            queryPAL() {
                var self = this;
                //根据部门id和时间
                var url = "api/control/query/inventory?dateE=" + this.endTime + "&dateS=" + this.startTime + "&wh=" + this.deptId
               // var url = "api/control/query/inventory?dateE=" + this.endTime + "&dateS=" + this.startTime + "&wh=0000"
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: false,
                    method: "get",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        // console.log(ret.data.length, "获取到的月数据");
                        if (ret.data.length === 0) {
                            _g.toast("该时间范围内没有数据。");
                        }
                        if (ret === 200) {
                            self.initList = JSON.parse(JSON.stringify(ret.data))
                            self.palList = ret.data;
                            console.log(ret.data)
                            for (var i of self.palList) {
                                // i.prdName = i.prdName.trim();
                                i.imoney = (+i.imoney || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                i.omoney = (+i.omoney || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                i.smoney = (+i.smoney || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                            }
                        }

                    },
                });
            },
            queryThisYear() {
                let self = this;
                //根据部门id和时间
                let year = this.endTime.substring(0, 4);
                // var url = "api/control/query/queryCostByYear?wh=" + "0000" + "&year=" + year;
                var url = "api/control/query/queryCostByYear?wh=" + this.deptId + "&year=" + year;
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: false,
                    method: "get",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        console.log(ret.data.length, "获取到的年区间内数据");
                        if (ret.data.length === 0) {
                            _g.toast("该时间范围内没有数据。");
                        }
                        let X1 = [];
                        let X2 = [];
                        let X3 = [];
                        let X4 = [];
                        let X5 = [];
                        if (ret.code === 200) {
                            var arr = ret.data;
                           // console.log(arr);

                            //将list数组按照prdName分组
                            var map = {}, dest = [];
                            for (var i = 0; i < arr.length; i++) {
                                var ai = arr[i];
                                if (!map[ai.prdName]) {
                                    dest.push({
                                        prdName: ai.prdName,
                                        data: [ai]
                                    });
                                    map[ai.prdName] = ai;
                                } else {
                                    for (var j = 0; j < dest.length; j++) {
                                        var dj = dest[j];
                                        if (dj.prdName === ai.prdName) {
                                            dj.data.push(ai);
                                            break;
                                        }
                                    }
                                }
                            }

                            console.log(dest);

                            //赋值给legend        
                            var names = [];
                            //赋值给series
                            var mySeries = [];
                            // console.log(dest)
                            for (let m = 0; m < dest.length; m++) {
                                names.push(dest[m].prdName);
                                console.log(dest[m])
                                for (let n = 0; n < dest[m].data.length; n++) {
                                    let x = dest[m].data[n].yearMonth.substring(5);
                                    //console.log(dest[m])
                                    switch (m) {
                                        case 0:
                                            X1[x - 1] = dest[m].data[n].smoney;
                                            break;
                                        case 1:
                                            X2[x - 1] = dest[m].data[n].smoney;
                                            break;
                                        case 2:
                                            X3[x - 1] = dest[m].data[n].smoney;
                                            break;
                                        case 3:
                                            X4[x - 1] = dest[m].data[n].smoney;
                                            break;
                                        case 4:
                                            X5[x - 1] = dest[m].data[n].smoney;
                                            break;
                                    }
                                }
                            }
                            // console.log(X1)
                            // console.log(X2)
                            // console.log(X3)
                            // console.log(X4)
                            // console.log(X5)

                            mySeries.push({
                                name: names[0],
                                type: "line",
                                // stack: '费用',
                                data: X1,
                                lineStyle: { color: "#24A9DE", width: 2 },
                                smooth: true
                            });
                            mySeries.push({
                                name: names[1],
                                type: "line",
                                // stack: '费用',
                                data: X2,
                                lineStyle: { color: "#99E187", width: 2 },
                                smooth: true
                            });
                            mySeries.push({
                                name: names[2],
                                type: "line",
                                // stack: '费用',
                                data: X3,
                                lineStyle: { color: "#403EEE", width: 2 },
                                smooth: true
                            });
                            mySeries.push({
                                name: names[3],
                                type: "line",
                                // stack: '费用',
                                data: X4,
                                lineStyle: { color: "#AD6FFE", width: 2 },
                                smooth: true
                            });
                            mySeries.push({
                                name: names[4],
                                type: "line",
                                // stack: '费用',
                                data: X5,
                                lineStyle: { color: "#EC5652", width: 2 },
                                smooth: true
                            });
                            

                            let x = self.startTime.substring(5, 7);
                            let y = self.endTime.substring(5, 7);
                            if (x < 10) {
                                x = x.substring(1, 2);
                            }
                            if (y < 10) {
                                y = y.substring(1, 2);
                            }
                            var year = [
                                "1月",
                                "2月",
                                "3月",
                                "4月",
                                "5月",
                                "6月",
                                "7月",
                                "8月",
                                "9月",
                                "10月",
                                "11月",
                                "12月",
                            ];
                            var xAxisData = year.splice(x - 1, y - x + 1);
                            //console.log(xAxisData);
                            var endPercent = (6 / xAxisData.length) * 100;
                            var option = {
                                // title: {
                                //     text: '折线图堆叠'
                                // },
                                //放在图上显示数据
                                tooltip: {
                                    trigger: "axis",
                                },
                                color: ["#24A9DE", "#99E187", "#403EEE", "#AD6FFE", "#EC5652"],
                                legend: {
                                    icon: "rect",
                                    x: "center",
                                    y: "bottom",
                                    padding: [0, 0, 0, 0],
                                    itemHeight: 10,
                                    itemWidth: 10,
                                    data: [],
                                },
                                grid: {
                                    left: "4%",
                                    right: "3%",
                                    bottom: "13%",
                                    containLabel: true,
                                },
                                //保存为图片
                                // toolbox: {
                                //     feature: {
                                //         saveAsImage: {}
                                //     }
                                // },
                                xAxis: {
                                    type: "category",
                                    boundaryGap: false,
                                    data: xAxisData,
                                },
                                yAxis: {
                                    name: "           单位：万元",
                                    type: "value",
                                },
                                series: [],

                                //   X轴设置滚动条
                                dataZoom: [
                                    //给x轴设置滚动条
                                    {
                                        start: 0, //默认为0
                                        end: endPercent,
                                        type: "slider",
                                        show: false,
                                        xAxisIndex: [0],
                                        handleSize: 0, //滑动条的 左右2个滑动条的大小
                                        height: 0, //组件高度
                                        left: 50, //左边的距离
                                        right: 40, //右边的距离
                                        bottom: 26, //右边的距离
                                        handleColor: "#ddd", //h滑动图标的颜色
                                        handleStyle: {
                                            borderColor: "#cacaca",
                                            borderWidth: "1",
                                            shadowBlur: 2,
                                            background: "#ddd",
                                            shadowColor: "#ddd",
                                        },
                                        fillerColor: new echarts.graphic.LinearGradient(
                                            1,
                                            0,
                                            0,
                                            0,
                                            [
                                                {
                                                    //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                                                    //给第一个设置0，第四个设置1，就是垂直渐变
                                                    offset: 0,
                                                    color: "#1eb5e5",
                                                },
                                                {
                                                    offset: 1,
                                                    color: "#5ccbb1",
                                                },
                                            ]
                                        ),
                                        backgroundColor: "#ddd", //两边未选中的滑动条区域的颜色
                                        showDataShadow: false, //是否显示数据阴影 默认auto
                                        showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                                        handleIcon:
                                            "M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z",
                                        filterMode: "filter",
                                    },
                                    //下面这个属性是里面拖到
                                    {
                                        type: "inside",
                                        show: true,
                                        xAxisIndex: [0],
                                        start: 0, //默认为1
                                        end: 50,
                                    },
                                ],
                            };
                            if (ret.data.length !== 0) {
                                option.grid.left = '0%';
                            }
                            var myChart = echarts.init(document.getElementById("myChart"));
                            myChart.setOption(option);
                            myChart.dispatchAction({
                                type: 'showTip',
                                seriesIndex: 0,
                                dataIndex: 0
                            })
                        }
                    },
                });
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
                var bdHtml = document.getElementById("table1").innerHTML; //打印内容赋值innerHTML绘制新页面（window.print()打印当前页)
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
            },
            //!导出Excel
            exportExcel() {
                //console.log(this.palList,'仅仅是计算机')
                if (this.initList.length === 0) {
                    _g.toast('表格暂无数据')
                } else {
                    console.log(this.initList, 'initList数据')
                    var url = "api/control/exportErp/exportExcel";
                    var option = {
                        data: {
                            createHeader: true,
                            tableName: '存货明细表',
                            title: this.startTime + "到" + this.endTime  + '-' + _g.getLS('companyName') + '-存货明细表'+ '-币种：（CNY）',
                            list: this.palList,
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
                            if (ret.code === 200) {
                                _g.toast(ret.message)
                                window.location.href = ret.data
                            } else {
                                _g.toast(ret.message)
                            }
                        },
                    });
                }

            },
        },
    });
    module.exports = {};
});

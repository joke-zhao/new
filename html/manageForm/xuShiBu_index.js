define(function (require, exports, module) {
    var Http = require("U/http");
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: "#main",
        components: { vant },
        template: _g.getTemplate("manageForm/xuShiBu_index_view"),
        data: {
            currentPage: 1,
            pages: 1,

            //科目
            showSubjectPicker1: false,
            showSubjectPicker2: false,
            subject1: '1001',
            subject2: '1002',
            accNoList: ['1001','1002'],
            //科目级别
            level1: '1',
            level2: '1',
            levelColumns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            levelColumns2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            showLevelPicker1: false,
            showLevelPicker2: false,


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
            startTime: new Date().Format("yyyy-MM-dd"),
            endTime: new Date().Format("yyyy-MM-dd"),
            yearMinDate: new Date(2015, 0, 1),
            yearMaxDate: new Date(2021, 11, 1),

            minDate: new Date(2010, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date().Format("yyyy-MM-dd"),

            value: "",
            showPicker: false,

            palList: [], //表数据
            initList: [], //表原始数据 生成excil使用
            isShow: false,
            isShowImg: true,
            moreImg: "../../image/manageForm/arrow.png",
            packUpMore: "../../image/manageForm/arrow2.png",
        },
        created: function () {
            this.deptId = _g.getLS("deptId");
            this.companyName = _g.getLS("companyName");
            this.selectAccNO();
            //查询时间段的数据
            this.queryPAL();
        },
        mounted() { },
        filters: {},
        methods: {
            change(){
                console.log("页码"+this.currentPage);
                this.queryPAL();
            },
            //确定科目级别
            onLevel1(value) {
                this.level1 = value;
                this.showLevelPicker1 = false;
            },
            onLevel2(value) {
                this.level2 = value;
                this.showLevelPicker2 = false;
            },
            //获取所有的科目
            selectAccNO() {
                var self = this;
                var url = "api/control/bankdiarybill/selectAccNO";
                Http.ajax({
                    data: {},
                    isFile: false,
                    isJson: false,
                    method: "get",
                    isSync: false,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        self.accNoList = ret.data;
                        // console.log(ret.data)
                    },
                    error: function (err) {
                        console.log("错误" + err)
                    },
                })
            },
            //选择科目开始
            onsubject1(value) {
                this.subject1 = value;
                this.showSubjectPicker1 = false;
                // this.subjectColumns1 = []
                // for (let i = 0; i < 11 - value; i++) {
                //     this.subjectColumns2.push(value + i);
                // }
                // this.showSubjectPicker2 = true;
            },
            onsubject2(value) {
                this.subject2 = value;
                this.showSubjectPicker2 = false;
            },
            //选择科目结束

            //开始时间确认
            onPicker1(time) {
                this.startTime = time.Format("yyyy-MM-dd");
                console.log(1 + "按时间区间查询");
                if (
                    this.startTime.substring(0, 4) === this.endTime.substring(0, 4) &&
                    this.startTime <= this.endTime
                ) {
                    // this.queryThisYear();
                    this.queryPAL();
                }
                this.showPicker1 = false;
            },
            //结束时间确认
            onPicker2(time) {
                this.endTime = time.Format("yyyy-MM-dd");
                //约束不能跨年
                if (this.endTime.substring(0, 4) !== this.startTime.substring(0, 4)) {
                    this.showPicker2 = false;
                    _g.toast(
                        this.startTime + "," + this.endTime + "不能跨年查询，请重新选择"
                    );
                }
                // //约束不能比起始日期小
                // else if (this.startTime <= this.endTime) {
                //     _g.toast("结束月份不能比起始月份小，请重新选择");
                // } else {
                    this.showPicker2 = false;
                    //console.log(this.endTime);
                    // this.queryThisYear();
                    this.queryPAL();
                // }
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
                this.sWater = 0;
                this.sWaterNumber = 0;
                this.sElectricity = 0;
                this.sElectricityNumber = 0;
                var self = this;
                //根据部门id和时间
               var url = "api/control/query/statement?accNoE="+this.subject2+"&accNoS="+this.subject1+"&dateE="+this.endTime+"&dateS="+this.startTime+
                   "&dep="+this.deptId+"&level1="+this.level1+"&level2="+this.level2+'&current='+this.currentPage+'&size=10000'
               // var url = "api/control/query/statement?accNoE="+this.subject2+"&accNoS="+this.subject1+"&dateE="+this.endTime+"&dateS="+this.startTime+
               //     "&dep="+"A1000001"+"&level1="+this.level1+"&level2="+this.level2+'&current='+this.currentPage+'&size=10000'
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
                        if (ret.code === 200) {
                            self.initList = JSON.parse(JSON.stringify(ret.data.records))
                            self.palList = ret.data.records;
                            self.pages = ret.data.pages
                            // console.log(ret)
                            for (var i of self.palList) {
                                 i.amtn = (+i.amtn || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                            }
                            for (var i2 of self.initList) {
                                i2.camtn = (+i2.camtn || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                i2.yamtn = (+i2.yamtn || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
                                i2.damtn = (+i2.damtn || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");

                                if (i2.camtn === 0 || i2.camtn === 0.00 ||i2.camtn === '0' ||i2.camtn === '0.00'){
                                    i2.camtn = ''
                                }
                                if (i2.yamtn === 0 || i2.yamtn === 0.00 ||i2.yamtn === '0' ||i2.yamtn === '0.00'){
                                    i2.yamtn = ''
                                }
                                if (i2.damtn === 0 || i2.damtn === 0.00 ||i2.damtn === '0' ||i2.damtn === '0.00'){
                                    i2.damtn = ''
                                }

                            }
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
                            tableName: '序时簿',
                            title: this.startTime+"到"+this.endTime + '-' + _g.getLS('companyName') + '序时簿'+ '-币种：（CNY）',
                            list: this.initList,
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

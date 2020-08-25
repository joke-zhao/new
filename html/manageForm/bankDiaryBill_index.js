define(function (require, exports, module) {
    var Http = require("U/http");
    var vant = require("L/vant/vant.min.js");

    var main = new Vue({

        el: "#main",
        components: {vant},
        template: _g.getTemplate("manageForm/bankDiaryBill_index_view"),
        data: {
            //科目级别
            level1: '1',
            level2: '2',
            levelColumns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            levelColumns2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            //科目
            subject1: '1001',
            subject2: '1002',
            accNoList: ['1001','1002'],
            //公司信息
            deptId: '',
            companyName: "",
            dialogShow: false,
            date1: '',
            date2: '',
            date3: '',
            tableData: [],
            detailClassifyList: [],
            incomeYearList: [],
            incomeMonthList:[],
            depNames: [],
            tLastSum: 0,
            tYingSum: 0,
            tYiSum: 0,
            tSum: 0,
            //[期末余额数组]
            objNames: {},
            //以下是选择日期插件
            startTime: new Date().getFullYear() + '-01',
            // endTime: '2017-12',
            //改
            endTime: new Date().getFullYear() + '-12',
            minDate: new Date(2000, 0, 1),
            maxDate: new Date(2099, 10, 1),
            currentDate: new Date(),
            value: new Date().getFullYear() + '-01',
            start: '2019-01',
            endValue: '2019-12',
            showPicker: false,
            showLevelPicker1: false,
            showLevelPicker2: false,
            showSubjectPicker1: false,
            showSubjectPicker2: false,
            showPicker1: false,
            showPicker2: false,
            yearMinDate: new Date(2010, 0, 1),
            yearMaxDate: new Date(2030, 11, 1),
            //  ---点击显示表格
            isShow: true,
        //    打印 导出
            showShare: false,
            options: [
                { name: "图片", icon: "../../image/icon/image.png" },
                { name: "表格", icon: "../../image/icon/biao.png" },
                // { name: "pdf", icon: "../../image/icon/pdf.png" },
            ],
        //    查询到打印的科目List
            accNameList:[],
        },
        //切换更改
        created: function () {
            // this.deptId = "A1000001";
            // this.companyName = '广州数信区块链科技有限公司';
            this.deptId = _g.getLS("deptId");
            this.companyName = _g.getLS("companyName");
            this.selectDetailClassify();
        },
        mounted() {

        },
        filters: {},
        methods: {
            //获取所有的科目   银行固定1001-1002
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
                    },
                    error: function (err) {
                        console.log("错误" + err)
                    },
                })
            },
            //获取表格信息
            selectDetailClassify() {
                var self = this;
                var url = "api/control/bankdiarybill/selectDetailClassify";
                Http.ajax({
                    data: {
                        "data": {
                            "dep": this.deptId,
                            "startLevel": this.level1,
                            "endLevel": this.level2,
                            "accNO": this.subject1,
                            "endAccNO": this.subject2,
                            "startDate": this.startTime,
                            "endDate": this.endTime
                        }
                    },
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: false,
                    url: url,
                    success: function (ret) {
                        if (ret.code == 200) {
                            let incomeList = ret.data;
                            let accNO = ''
                            let subjectName = ''
                            var newArr = [];
                            for (let i = 0; i < incomeList.length; i++) {
                                if(newArr.indexOf(incomeList[i].accName) == -1){
                                    newArr.push(incomeList[i].accName)
                                }
                                self.accNameList=newArr


                                if (incomeList[i].subjectName == subjectName) {
                                    incomeList[i].subjectName = ''
                                } else {
                                    subjectName = incomeList[i].subjectName
                                }
                                incomeList[i].debit = (incomeList[i].debit || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
                                incomeList[i].credit = (incomeList[i].credit || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
                                incomeList[i].sum = (incomeList[i].sum || 0)
                                    .toFixed(2)
                                    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")

                            }
                            self.detailClassifyList = incomeList;
                            main.incomeMonthList=incomeList
                            console.log(self.detailClassifyList)
                            console.log(self.accNameList);
                        } else {
                            _g.toast("该查询范围没有结果")
                            console.log(ret);
                        }
                    },
                })
            },
            //转换年月
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
            },
            //确定科目级别
            onLevel1(value) {
                this.level1 = value;
                this.showLevelPicker1 = false;
                this.levelColumns2 = []
                for (let i = 0; i < 11 - value; i++) {
                    this.levelColumns2.push(value + i);
                }
                this.showLevelPicker2 = true;
            },
            onLevel2(value) {
                this.level2 = value;
                this.showLevelPicker2 = false;
                this.selectDetailClassify();
            },
            //确定科目
            //确定科目级别
            onsubject1(value) {
                this.subject1 = value;
                this.showSubjectPicker1 = false;
                this.subjectColumns1 = []
                for (let i = 0; i < 11 - value; i++) {
                    this.subjectColumns2.push(value + i);
                }
                this.showSubjectPicker2 = true;
            },
            onsubject2(value) {
                this.subject2 = value;
                this.selectDetailClassify();
                this.showSubjectPicker2 = false;
            },
            //确定日期
            onStart(time) {
                if ((time.getMonth() + 1) < 10) {
                    this.startTime = time.getFullYear() + '-0' + (time.getMonth() + 1);
                } else {
                    this.startTime = time.getFullYear() + '-' + (time.getMonth() + 1);
                }
                //约束不能跨年
                if (this.endTime.substring(0, 4) == this.startTime.substring(0, 4) && parseInt(this.startTime.substring(5, 7)) < parseInt(this.endTime.substring(5, 7))) {
                    this.showPicker1 = false;
                    this.selectDetailClassify();
                } else {
                    this.showPicker1 = false;
                    this.showPicker2 = false;
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
                    this.selectDetailClassify();
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
                            tableName:'现金银行日记账',
                            title:main.value +'~'+ main.companyName + '~现金银行日记账',
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
    var _page = {};

    //_page.initSwiper();
    (function () {
    })();
    module.exports = {};
});

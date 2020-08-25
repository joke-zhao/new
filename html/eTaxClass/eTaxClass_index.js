define(function (require, exports, module) {
    var Http = require("U/http");
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: "#main",
        template: _g.getTemplate("eTaxClass/eTaxClass_index_view"),
        data: {
            flag: 1,

            //!e税学堂 -------------------------------
            bookTypeList: [], //书籍类型
            bookList: [], //书籍列表
            bindex: 0, //书籍类型下标
            classTypeList: [], //课程类型
            classList: [], //课程列表
            cindex: 0, //课程类型下标

            //!回答社区 -------------------------------
            searchVal: '', //搜索框输入的值
            searchList:[],//搜索出来的List
            hotnewTab: [{
                name: '热门',
            }, {
                name: '最新',
            },],
            hotAndnew: 0, //热门标签为0  最新标签为1  搜索出来的为2
            HotList: [], //热门问题
            NewList: [], //最新问题

        },
        created: function () {
            // 查询电子书类型
            this.selectBookType();
            // 查询课程类型
            this.selectClassType();
        },
        components: {
            vant,
        },
        methods: {
            // tab点击
            handleTab(val) {
                this.flag = val;
                console.log(val)
                console.log(this.flag)
                if (this.flag === 2) {
                    this.selectHotProblem()
                }
            },
            //!e税学堂 -------------------------------

            //查询课程类型
            selectClassType() {
                var url = "api/control/beatCourseType/viewBeatCourseType";
                Http.ajax({
                    url: url,
                    data: {},
                    method: 'post',
                    isSync: false,
                    isJson: false,
                    lock: false,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.classTypeList = ret.data; //课程类型列表
                            main.getCourseByType(ret.data[0].name, 0)
                        }
                    }
                })
            },
            //根据课程类型查询课程列表
            getCourseByType(name, index) {
                this.cindex = index;
                var url = "api/control/beatCourse/getCourseByType";
                var option = {
                    data: {
                        type: name
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: 'post',
                    isSync: false,
                    isJson: true,
                    lock: true,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.classList = ret.data
                        }
                    }
                })
            },
            //查询电子书类型
            selectBookType() {
                var url = "api/control/beatTxtType/viewBeatTxtType";
                Http.ajax({
                    url: url,
                    data: {},
                    method: 'post',
                    isSync: false,
                    isJson: false,
                    lock: false,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.bookTypeList = ret.data; //书籍类型列表
                            main.getTxtByType(ret.data[0].name, 0)
                        }
                    }
                })
            },
            //根据电子书类型查询电子书列表
            getTxtByType(name, index) {
                this.bindex = index;
                var url = "api/control/beatTxt/getTxtByType";
                var option = {
                    data: {
                        type: name
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: 'post',
                    isSync: false,
                    isJson: true,
                    lock: true,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.bookList = ret.data
                        }
                    }
                })
            },



            //!回答社区 -------------------------------

            //搜索框事件监听（用于搜索框 手机键盘点击搜索）
            onSearch() {
                if(this.searchVal){
                    var url = "api/control/beatProblem/selectProblem";
                    var option = {
                        data: {
                            name: this.searchVal
                        }
                    }
                    Http.ajax({
                        url: url,
                        data: option,
                        method: 'post',
                        isSync: false,
                        isJson: true,
                        lock: false,
                        success: function (ret) {
                            if (ret.code === 200) {
                                if(ret.data.length>0){
                                    main.hotAndnew = 2; 
                                    main.searchList = ret.data; //此处把搜索出来的列表替换到热门list里
                                }else{
                                    main.hotAndnew = 0; 
                                    _g.toast("暂无该问题")
                                }
                            }
                        }
                    })
                }else{
                    _g.toast("请输入要搜索的问题")
                }
            },
            // 热门标签或者最新标签查询
            selectHotorNew(index) {
                this.hotAndnew = index;
                if (this.hotAndnew === 0 || index === 0) {
                    this.selectHotProblem()
                }
                if (this.hotAndnew === 1 || index === 1) {
                    this.selectNewProblem()
                }
            },

            //查询热门问题
            selectHotProblem() {
                var url = "api/control/beatProblem/selectPopularProblem";
                Http.ajax({
                    url: url,
                    data: {},
                    method: 'post',
                    isSync: false,
                    isJson: false,
                    lock: true,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.HotList = ret.data; //热门问题列表
                        }
                    }
                })
            },
            //查询最新问题
            selectNewProblem() {
                var url = "api/control/beatProblem/selectNewProblem";
                Http.ajax({
                    url: url,
                    data: {},
                    method: 'post',
                    isSync: false,
                    isJson: false,
                    lock: true,
                    success: function (ret) {
                        if (ret.code === 200) {
                            main.NewList = ret.data; //热门问题列表
                        }
                    }
                })
            },
            //打开问题详情
            openProblemDetails(id) {
                _g.openWin({
                    header: {
                        title: '问题详情'
                    },
                    name: "problem-details",
                    url: "../eTaxClass/problem_details_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        proId: id
                    } //携参
                })
            },
            //打开课程详情
            openClassDetails(id) {
                _g.openWin({
                    header: {
                        title: '课程详情'
                    },
                    name: "class-details",
                    url: "../eTaxClass/class_details_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        classId: id
                    } //携参
                })
            },
            //打开书籍详情
            openBookDetails(id) {
                _g.openWin({
                    header: {
                        title: '电子书详情'
                    },
                    name: "book-details",
                    url: "../eTaxClass/book_details_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        bookId: id
                    } //携参
                })
            },
            //打开发布问题
            openReportProblem() {
                _g.openWin({
                    header: {
                        title: '发布问题'
                    },
                    name: "report-question",
                    url: "../eTaxClass/report_question_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
        },
        filters: {
            formatDate(date) {
                if (!date) {
                    return '暂无时间';
                } else {
                    var a = new Date(date).Format("yyyy-MM-dd hh:mm:ss")
                    return a
                }
            },
        },
    });

    window.rightBtnTap = function () {
        _g.openWin({
            header: {
                title: '发布问题'
            },
            name: "report-question",
            url: "../eTaxClass/report_question_frame.html",
            bounces: false,
            slidBackEnabled: false,
            bgColor: '#fff',
            pageParam: {} //携参
        })
    };
    var _page = {};
    (function () { })();
    module.exports = {};
});

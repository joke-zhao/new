define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('message/unilateralCheck_view'),
        data() {
            return{
                show: false,
                show1: true,
                show2: true,
                receiptsList: [],
                aSingleList: [],
                reportList: [],
                fundList: [],
                financialAnalysisList: [],
                submitMessage: {},
                type: parseInt(api.pageParam.type)
            }

        },
        created: function () {

            this.notice(this.type) ;


            //消息类型
            // 1.单据核对
            // this.notice(1) ;
            // // 2.取单通知.
            // this.notice(2);
            // // // 3报表确认
            // this.notice(3);
            // // // 4.款项通知
            // this.notice(4);
            // // // 5.财税分析"
            // this.notice(5);

        },
        filters: {
            formatDate(date) {
                if (!date) {
                    return '暂无时间';
                } else {
                    // var a = new Date(date).Format("yyyy-MM-dd hh:mm:ss")
                    var time = new Date(date).Format("yyyyMMdd");//数据时间
                    var week = new Date(date).getDay();
                    var getTime = new Date().Format("yyyyMMdd")//当前时间
                    var weekTime = new Date().getDay();
                    var weeks = ["日","一","二","三","四","五","六"];
                    var getWeek = "星期" + weeks[week];
                    if(time - getTime < 7 && week - weekTime === 0){
                        time = new Date(date).Format(getWeek+"hh:mm");
                    }else{
                        time = new Date(date).Format("yyyy-MM-dd hh:mm");
                    }
                    return time
                }
            },
        },
        methods: {
            showPopup(item) {

                this.submitMessage = item;
                console.log(this.submitMessage);
                this.show1 = true;
                this.show2 = true;
                this.show = true;

            },
            select1() {
                this.show1 = !this.show1
                if (!this.show1) {
                    this.show2 = true
                }
            },
            select2() {
                this.show2 = !this.show2
                if (!this.show2) {
                    this.show1 = true
                }
            },
            // 通知消息
            notice(informType){
                    console.log(informType);
                    var url = "api/control/beatInform/selectInformList";
                    var option = {
                        data: {
                            informType: informType,
                            // userId: '001'
                            userId: _g.getLS("userId")
                        },
                        limit: 10,
                        page: 1,
                    }
                    Http.ajax({
                        data: option,
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: false,
                        lock: false,
                        url: url,
                        success: function (ret) {
                            if (ret.code === 200) {
                                if(ret.data.list.length === 0){
                                    _g.toast("没有通知")
                                }
                                switch (informType) {
                                    case 1:
                                        main.receiptsList = ret.data.list;
                                        break;
                                    case 2:
                                        main.aSingleList = ret.data.list;
                                        break;
                                    case 3:
                                        main.reportList = ret.data.list;
                                        break;
                                    case 4:
                                        main.fundList = ret.data.list;
                                        break;
                                    case 5:
                                        main.financialAnalysisList = ret.data.list;
                                        break;
                                }

                            }
                        },
                    });

            },


            submit(){
                // console.log(this.show1)
                // console.log(this.show2)

                if (!this.show1){
                    var url = "api/control/beatInform/updateInform";
                    var option = {
                        data: {
                            id: this.submitMessage.id,
                            status: 1
                        },
                        limit: 10,
                        page: 1,
                    }
                    Http.ajax({
                        data: option,
                        isFile: false,
                        isJson: true,
                        method: "post",
                        isSync: false,
                        lock: false,
                        url: url,
                        success: function (ret) {
                            if (ret.code === 200) {
                                main.show = false;
                                for (let i =1;i<6;i++){
                                    main.notice(i);
                                }
                            }else {
                                _g.toast("提交失败");
                            }
                        },
                    });
                }else if (!this.show2){
                    //跳转到拍照
                    _g.openWin({
                        header: {},
                        name: "pat",
                        url: "../pat/pat_index_frame.html",
                        bounces: false,
                        slidBackEnabled: false,
                        bgColor: '#fff',
                        pageParam: {} //携参
                    })
                    this.show=false

                }else {
                    _g.toast("请选择是否完成");
                }

            }

        }
    });

    (function () {

    })();
    module.exports = {};
});

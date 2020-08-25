define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var area = require('U/area');
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('cooperation/applicationAgency_view'),
        data: {
            enterpriseName:'',
            yourName:'',
            phone:'',
            reasonable:'',
            //区域选择
            areaList: [],
            show: false,
            province: '省',
            city:'市',
            county: '区'
        },
        created: function () {
            this.areaList = area
        },
        filters: {

        },
        methods:{
            // 选择区域
            handleCancel() {
                this.show = false;
            },
            //选择区域
            handleConfirm(e) {
                this.province = e[0].name;
                this.city = e[1].name;
                this.county= e[2].name;
                this.show = false;
            },
        //    提交
            submit(){
                var self = this;
                var url = "api/control/beatAgentRecruitment/createBeatAgentRecruitment";
                var option={
                    data: {
                        "accountNumber": _g.getLS("userPhone"),
                        "area": main.province+main.city+main.county,
                        "businessName": main.enterpriseName,
                        "createTime": new Date().getTime(),
                        "name": main.yourName,
                        "phone": main.phone,
                        "reason": main.reasonable,
                        "userId":  _g.getLS("userId")
                    }
                }
                Http.ajax({
                    data: option,
                    isFile: false,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: url,
                    success: function (ret) {
                        if(ret.code===200){
                            main.enterpriseName=''
                            main.yourName=''
                            main.phone=''
                            main.reasonable=''
                            _g.toast("提交成功")
                            setTimeout(() => {
                                main.openJoin();
                            }, 2000);
                        }else{
                            _g.toast("提交失败")
                        }
                    }
                })
            },
        //    跳转设置页面
            openJoin(){
                _g.openWin({
                    header:{title:'我要合作'},
                    name:"cooperation-index",
                    url:"../cooperation/cooperation_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            }
        }
    });




    (function () {

    })();
    module.exports = {};
});

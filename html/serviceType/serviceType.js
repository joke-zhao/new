define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('serviceType/serviceType_view'),
        data: {
            typeList:{},
            selectTypeList:[],
            isActive: [false],
            y: 'servicetype-content-list-y',
            n: 'servicetype-content-list-n',
        },
        created: function () {
            this.queryServiceType();
        },
        methods:{
            //查询所有服务类型
            queryServiceType(){
                var url = "api/control/beatServerType/selectBeatServerTypeList";
                var option = {
                    data: {},
                    limit: 100,
                    page: 1

                };
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
                            main.typeList = ret.data.records;
                            console.log(ret.data.records)
                        }
                    },
                });
            },

            //确认后跳转框
            open() {
                this.selectTypeList = this.selectTypeList.filter(function (s) {
                    return s;
                });
                console.log(this.selectTypeList)
                if (this.selectTypeList.length<3){
                    _g.execScript({
                        winName: "index-enterInfo-win",
                        frameName: "index-enterInfo-frame",
                        fnName: "fnName",
                        data: {
                            selectTypeList:main.selectTypeList
                        }
                    });
                    api.closeWin();
                }else {
                    _g.toast("最多只能选择三项!")

                }
            },
            // 选择服务类型
            select(item,index){
                if (!this.isActive[index]){
                    this.selectTypeList[index] = item
                }else {
                    this.selectTypeList.splice(index, 1);
                }
                this.isActive[index] = !this.isActive[index]
                this.$forceUpdate()

            }

        },
    });

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

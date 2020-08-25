define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/everyday_consult_view'),
        data: {
            tabList: [],
            tabActive: 0,
            consultList: []
        },
        created() {
            this.loadTagList()
        },
        methods:{
            changeTab(index) {
                if (this.tabActive !== index) {
                    this.loadConsultList(this.tabList[index].type)
                }
                this.tabActive = index
            },
            loadTagList() {
                Http.ajax({
                    data: {},
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatNewsType/viewBeatNewsType',
                    success: result => {
                        if (result.code === 200) {
                            this.tabList = result.data
                            this.loadConsultList(this.tabList[0].type)
                        }
                    }
                })
            },
            loadConsultList(type) {
                Http.ajax({
                    data: {
                        data: {
                            type: type
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatTaxNews/getTaxNewsByType',
                    success: result => {
                        if (result.code === 200) {
                            this.consultList = result.data
                        }
                    }
                })
            },
            openDetail(id) {
                _g.openWin({
                    header: {
                        title: '税讯详情'
                    },
                    name: "consult-detail",
                    url: "../home/consult_detail_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {
                        id: id
                    }  //携参
                })
            }
        },
        filters: {
            dateFormat(value){
                let date = new Date(value)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()
                return year + '-' + month + '-' + day
            }
        }
    });
    module.exports = {};
});

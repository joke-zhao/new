define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require('L/vant/vant.min.js')
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('my/my_service_view'),
        data: {
            list: [],
            dialogShow: false,
            deleteIndex: -1
        },
        components: {
            vant
        },
        created: function () {
            //_g.alert(_g.getLS('userId'))
            this.loadList()
        },
        filters: {

        },
        methods:{
            deleteCancel() {
                this.deleteIndex = -1
                this.dialogShow = false
            },
            deleteConfirm() {
                Http.ajax({
                    data: {
                        data: {
                            "id": this.list[this.deleteIndex].id
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatServer/deleteBeatServer',
                    success: result => {
                        if (result.code === 200) {
                            _g.toast('删除成功')
                            this.deleteIndex = -1
                            this.dialogShow = false
                            this.loadList()
                        }
                    }
                })
            },
            deleteItem(index){
                this.deleteIndex = index
                this.dialogShow = true
            },
            loadList() {
                Http.ajax({
                    data: {
                        data: {
                            //_g.getLS('userId')
                            //4028818b7356d292017356dc06080010
                            userId: _g.getLS('userId')//_g.getLS('userId')
                        }
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: 'api/control/beatServer/viewBeatServerByUserId',
                    success: result => {
                        if (result.code === 200) {
                            this.list = result.data
                        }
                    }
                })
            }
        }
    });
    (function () {

    })();
    module.exports = {};
});

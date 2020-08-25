define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('my/cash_out_view'),
        data: {
            list: []
        },
        created() {
            this.selectCashOut()
        },
        filters: {
            dateFormat(value) {
                let date = new Date(value)
                let month = date.getMonth() + 1
                let day = date.getDate()
                let hour = date.getHours()
                let min = date.getMinutes()
                return month + '月' + day + '日 ' + hour + ':' + min
            }
        },
        methods:{
            selectCashOut(){
                let url = 'api/control/beatDeposit/selectBeatDepositList'
                let postData = {
                    data: {
                        //4028818b7356d292017356dc06080010 ,_g.getLS('userId')
                        userId: _g.getLS('userId')
                    }
                }
                Http.ajax({
                    data: postData,
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: url,
                    success: result => {
                        if (result.code === 200) {
                            this.list = result.data
                            console.log(result.data)
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

define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('home/consult_detail_view'),
        data: {
            consultData: {}
        },
        created: function () {
            let id = api.pageParam.id
            Http.ajax({
                data: {
                    data: {
                        id: id
                    }
                },
                isJson: true,
                method: "post",
                isSync: true,
                lock: true,
                url: 'api/control/beatTaxNews/viewBeatTaxNews',
                success: result => {
                    if (result.code === 200) {
                        this.consultData = result.data
                        console.log(this.consultData)
                    }
                }
            })
        },
        filters: {
            dateFormat(value) {
                let date = new Date(value)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()
                return year + '-' + month + '-' + day
            }
        },
        methods:{

        }
    });
    (function () {

    })();
    module.exports = {};
});

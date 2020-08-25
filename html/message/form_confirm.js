define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('message/form_confirm_view'),
        data: {
            showDialog: false,
            showResult: false
        },
        created: function () {

        },
        filters: {

        },
        methods:{
            confirm() {
                this.showResult = true
                this.showDialog = false
            }
        }
    });

    (function () {

    })();
    module.exports = {};
});

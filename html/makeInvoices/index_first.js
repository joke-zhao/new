define(function (require, exports, module) {

    var Http = require('U/http');
    
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('makeInvoices/index_first_view'),
        data: {
            // 是否开通支付
            isDredge:false
        },
        filters: {
            
        },
        methods: {
            handleDredge() {
                this.isDredge = !this.isDredge
            }
        }
    });


    var _page = {};
    
    (function () {
        
    })();
    module.exports = {};
});

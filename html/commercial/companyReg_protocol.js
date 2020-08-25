define(function (require, exports, module) {

    var Http = require('./node_modules/U/http');
    
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('commercial/companyReg_protocol_view'),
        data: {},
        filters: {
            
        },
        methods: {
            onTestTap: function () {
                console.log(2222);
            }
        }
    });


    var _page = {};
    
    (function () {
        
    })();
    module.exports = {};
});

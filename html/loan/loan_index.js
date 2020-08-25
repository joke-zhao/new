define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('loan/loan_index_view'),
        data: {
            value1: '',
            value2: '',
            value3: '',
            pattern: /\d{6}/,
        },
        created: function () {

        },
        filters: {

        },
        methods:{
            validator(val) {
                return /^1[3456789]\d{9}$/.test(val);
            },
            // 异步校验函数返回 Promise
            asyncValidator(val) {
                return new Promise((resolve) => {
                    Toast.loading('验证中...');

                    setTimeout(() => {
                        Toast.clear();
                        resolve(/\d{6}/.test(val));
                    }, 1000);
                });
            },
            onFailed(errorInfo) {
                console.log('failed', errorInfo);
            },
        },
    });




    (function () {

    })();
    module.exports = {};
});

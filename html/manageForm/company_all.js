define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('manageForm/company_all_view'),
        data: {
            deptId: 'A1000001'
        },
        created: function () {

        },
        filters: {

        },
        methods:{
            initIncomeChart() {
                // 基于准备好的dom，初始化echarts实例
                let income = echarts.init(document.getElementById('income'))
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: 60, name: '收入60%'},
                                {value: 10, name: '收入10%'},
                                {value: 20, name: '收入20%'},
                                {value: 30, name: '收入30%'},
                            ]
                        }
                    ]
                }
                income.setOption(option)
            },
            initSaleChart() {
                let sale = echarts.init(document.getElementById('sale'))
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['产品名称', '项目名称'],
                        left: 0,
                        bottom: 0,
                        icon: 'rect'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                    yAxis: {
                        name: '单位：PCS',
                        type: 'value',
                        axisLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '产品名称',
                            data: [0,3,10,15,27,29,30,22,39,42,46,50],
                            type: 'line',
                            smooth: true,
                        },
                        {
                            name: '项目名称',
                            data: [0,0,0,20,30,21,43,41,30,26,28,40],
                            type: 'line',
                            smooth: true,
                        }
                    ],
                    backgroundColor: '#F0F8FA'
                }
                sale.setOption(option)
            },
            initRateChart() {
                let rate = echarts.init(document.getElementById('rate'))
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['毛利率1', '毛利率2'],
                        bottom: 0,
                        left: 0,
                        icon: 'rect'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                    yAxis: {
                        name: '单位：PCS',
                        type: 'value',
                        axisLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '毛利率1',
                            data: [0,3,10,15,27,29,30,22,39,42,46,50],
                            type: 'line',
                            smooth: true,
                        },
                        {
                            name: '毛利率2',
                            data: [0,0,0,20,30,21,43,41,30,26,28,40],
                            type: 'line',
                            smooth: true,
                        }
                    ],
                    backgroundColor: '#F0F8FA'
                }
                rate.setOption(option)
            },
            initDayChart() {
                let day = echarts.init(document.getElementById('dayChart'))
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['毛利率1', '毛利率2'],
                        bottom: 0,
                        left: 0,
                        icon: 'rect'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                    yAxis: {
                        name: '单位：PCS',
                        type: 'value',
                        axisLine: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '毛利率1',
                            data: [0,3,10,15,27,29,30,22,39,42,46,50],
                            type: 'line',
                            smooth: true,
                        },
                        {
                            name: '毛利率2',
                            data: [0,0,0,20,30,21,43,41,30,26,28,40],
                            type: 'line',
                            smooth: true,
                        }
                    ],
                    backgroundColor: '#F0F8FA'
                }
                day.setOption(option)
            }
        },
        mounted() {
            //线上环境将其打开
            //this.deptId = _g.getLS("deptId");
            this.initIncomeChart()
            this.initSaleChart()
            this.initRateChart()
            this.initDayChart()
        }
    });

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {
                // direction: 'horizontal',
                // initialSlide: 0,
                // autoplay: 1000
                // autoplayStopOnLast: true
            });
            // var homeBanner = new Swiper('#banner', {
            //     direction: 'horizontal',
            //     loop: true,
            //     autoplay: 5000,
            //     pagination: '#banner .swiper-pagination',
            //     bulletActiveClass: 'is-active',
            //     autoplayDisableOnInteraction: false,
            //     onSliderMove: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: false
            //         });
            //     },
            //     onTouchEnd: function () {
            //         api.setFrameAttr({
            //             name: 'home-index-frame',
            //             bounces: true
            //         });
            //     },
            // })
        }
    };

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

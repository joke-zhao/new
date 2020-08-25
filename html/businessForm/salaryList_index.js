
define(function (require, exports, module) {
    var Http = require("U/http");
    var swiper = require("L/swiper/swiper.min.js");
  
    
    var vant = require("L/vant/vant.min.js");
    var element = require("L/element/element.min.js");
    var main = new Vue({
        
      el: "#main",
      components:{vant},
      template: _g.getTemplate("businessForm/salaryList_index_view"),
      data: {
        dialogShow: false,
        
        tableData:[],
        date1: "",
      date2: "",
      show1: false,
      show2: false,
      },
      created: function () {},
      mounted() {
        var myChart = echarts.init(document.getElementById("myChart")); // 指定图表的配置项和数据
        var option = {
          // title: {
          //   text: "ECharts 入门示例",
          // },
          tooltip: {},
          
          xAxis: {
            type: "category",
            data: ["1月", "2月", "3月", "4月", "5月", "6月"],
          },
          yAxis: {
            name: '单位：万元',
            type: "value",
          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
              name: '直接访问',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '搜索引擎',
              type: 'line',
              stack: '总量',
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              },
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
          ],
          // legend: {
          //   data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          // },
        }; // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      filters: {},
      methods: {
        //加载图表
       //选择日期区间
      formatDate1(date1) {
        return `${date1.getMonth() + 1}/${date1.getDate()}`;
      },
      onConfirm1(date1) {
        const [start, end] = date1;
        this.show1 = false;
        this.date1 = `${this.formatDate1(start)} - ${this.formatDate1(end)}`;
      },
      //选择单个日期
      formatDate2(date2) {
        return `${date2.getMonth() + 1}/${date2.getDate()}`;
      },
      onConfirm2(date2) {
        this.show2 = false;
        this.date2 = this.formatDate2(date2);
      },
      },
    });
    
  //   Vue.use(vant.Lazyload);
    var _page = {
      initSwiper: function () {
        var swiper = new Swiper(".swiper-container", {
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
      },
    };
  
    //_page.initSwiper();
    (function () {})();
    module.exports = {};
  });
  
define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");

  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    components: { vant },
    template: _g.getTemplate("businessForm/placeList_index_view"),
    data: {
      dialogShow: false,
      date1: "",
      date2: "",
      date3: "",
      tableData: [],
      detailsShow: false,
      msg: "选择开始年月",
      msg1: "选择结束年月",
      msg2: "",
      deptName: "账王（广州）云科技有限公司", //公司名称
      detailsShowImg1: true,
      detailsShowImg2: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      currentDate: new Date(),
      maxDate: new Date(),
      maxDate1: new Date(),
      chooseDate:"",
      openChooseDate:false,
      name:"",//名称
      area:"",//面积
      rent:"",//租金
      pingEffect:"",//坪效
    },
    created: function () {},
    mounted() {
      let now = new Date();
      let startStr =
        now.getFullYear() +
        "-" +
        (now.getMonth() - 2 < 10
          ? "0" + (now.getMonth() - 2)
          : now.getMonth() - 2);
      let endStr =
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1);
      console.log(startStr, endStr);
      var data = {
        deptName:this.deptName,
        endDate:endStr,
        startDate:startStr
      }
      var url = "api/control/erpbusinessData/businessSite"
      Http.ajax({
      data:data,
      isFile: false,
      isJson: false,
      method: 'post',
      isSync: false,
      lock: false,
      url: url,
      success: function (ret) {
      if (ret.code == 200) {
       console.log(ret);
      }}
    })
    this.drawLineChart("myChart")
    },
    filters: {},
    methods: {
      //查看明细折叠
      showDetails() {
        this.detailsShow = !this.detailsShow;
        this.detailsShowImg1 = !this.detailsShowImg1;
        this.detailsShowImg2 = !this.detailsShowImg2;
      },
      formatter(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      formatter2(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      formatter3(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      //
      openPopup1() {
        this.show1 = !this.show1;
      },
      //
      openPopup2() {
        this.show2 = !this.show2;
      },
      //
      openPopup3() {
        this.show3 = !this.show3;
        this.show4 = true;
      },
      //开始时间弹框
      onConfirm1(value) {
        this.show1 = false;
        console.log(value);
        if (!value) {
          return "";
        } else {
          var a = new Date(value).Format("yyyy-MM");
          this.msg = a;
          console.log(this.msg);
        }
      },
      //结束时间弹框
      onConfirm2(value) {
        this.show2 = false;

        console.log(value);
        if (!value) {
          return "";
        } else {
          var a = new Date(value).Format("yyyy-MM");
          this.msg1 = a;
          console.log(this.msg1);
        }
      },
      //选择年月
      onConfirm3(value) {
        this.show3 = false;
        this.openChooseDate = true
        console.log(value);
        if (!value) {
          return "";
        } else {
          var a = new Date(value).Format("yyyy-MM");
          var m = value.getMonth() + 1;
          this.chooseDate = m
          this.deptName = "广州市和厚信息科技有限公司"
          var deptName = this.deptName;
          this.msg2 = a;
          console.log(this.msg2);
          var data = {
            deptName:deptName,
            selectDate:a
          };
          var url = "api/control/erpbusinessData/businessSite";
            Http.ajax({
            data:data,
            isFile: false,
            isJson: false,
            method: 'post',
            isSync: false,
            lock: false,
            url: url,
            success: function (ret) {
              if (ret.code == 200) {
              console.log(ret,"sssssss");
            }}
          })
        }
      },
      //绘制折线图
      drawLineChart(id, echartData) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
            bottom:'bottom',
            padding:[30,0,0,0]
        },
          xAxis: {
            type: "category",
            data: ["1月", "2月", "3月", "4月", "5月", "6月","七月"],
          },
          yAxis: {
            name: "单位：万元",
            type: "value",
          },
          series: [
            {
              name: "邮件营销",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: "联盟广告",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310],
            },
            {
              name: "视频广告",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410],
            },
            {
              name: "直接访问",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: [320, 332, 301, 334, 390, 330, 320],
            },
            {
              name: "搜索引擎",
              type: "line",
              stack: "总量",
              label: {
                normal: {
                  show: true,
                  position: "top",
                },
              },
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320],
            },
          ],
        };
        if (option && typeof option === "object") {
          myChart.setOption(option);
        }
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

define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myAskAnswer/myAskAnswer_index_view"),
    data: {
      flag: 1,
      askAnswerList: [],
      myAttentionList: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      totalPages: 0
    },
    created: function () {
      this.selectAskAnswerList();
      /* // 页面刷新
      window.UpdateRevFn = function () {
        main.askAnswerList = []
        main.pageNum = 1
        main.selectAskAnswerList()
      } */
    },
    watch: {
      // 如果 `flag` 发生改变，这个函数就会运行
      flag: function () {
        console.log(this.flag);
        if (this.flag === 1) {
          this.selectAskAnswerList();
          /* // 页面刷新
          window.UpdateRevFn = function () {
            main.askAnswerList = []
            main.pageNum = 1
            main.selectAskAnswerList()
          } */
        } else if (this.flag === 2) {
          this.selectMyAttentionList();
          /* // 页面刷新
          window.UpdateRevFn = function () {
            main.myAttentionList = []
            main.pageNum = 1
            main.selectMyAttentionList()
          } */
        }
      }
    },
    components: { vant },
    methods: {
      handleTab(val) {
        if (this.flag === val) return;
        this.flag = val;
      },
      selectAskAnswerList() {
        var self = this;
        var url = "/api/control/beatProblem/selectAllBeatProblem";
        var options = {
          page: this.pageNum,
          limit: this.pageSize,
          data: {
            userId: _g.getLS("userId"),
            // userId: "4028818972e587860172e58d3a970001",
          },
        };
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret);
            if (ret.code === 200) {
              main.askAnswerList = ret.data.list;
              main.total = ret.data.total;
              main.totalPages = ret.data.pages;
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
      selectMyAttentionList() {
        var self = this;
        var url = "/api/control/beatConcern/viewBeatConcern";
        var options = {
          page: this.pageNum,
          limit: this.pageSize,
          data: {
            userId: _g.getLS("userId"),
            // userId: "4028818972e587860172e58d3a970001",
          },
        };
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret);
            if (ret.code === 200) {
              main.myAttentionList = ret.data.list;
              main.total = ret.data.total;
              main.totalPages = ret.data.pages;
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
      //打开问题详情
      openProblemDetails(id,flag) {
        _g.openWin({
          header: {
            title: '问题详情'
          },
          name: "problem-details",
          url: "../myAskAnswer/problem_details_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: '#fff',
          pageParam: {
            proId: id,
            flag: flag
          } //携参
        })
      },
    },
    filters: {
      formatDate(date) {
        if (!date) {
          return '暂无时间';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd")
          return a
        }
      }
    },
  });
  /* _g.setPullDownRefresh(function () {
    main.pageNum = 1
    main.askAnswerList = []
    main.selectAskAnswerList()
  }); */
  _g.setLoadmore(10, function () {
    if (main.flag === 1) {
      if (main.pageNum >= main.totalPages) {
        _g.toast('数据已全部加载')
      } else {
        main.pageNum++
        main.selectAskAnswerList()
      }
    } else if (main.flag === 2) {
      if (main.pageNum >= main.totalPages) {
        _g.toast('数据已全部加载')
      } else {
        main.pageNum++
        main.selectMyAttentionList()
      }
    }
  });
  (function () { })();
  module.exports = {};
});

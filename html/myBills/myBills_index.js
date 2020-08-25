define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("myBills/myBills_index_view"),
    data: {
      flag: 1,
      invoicingList: [], //开票列表
      minDate: new Date(2010, 0, 1), // 日期范围
      checked: false,
      show: false, // 筛选弹框状态
      showDate: false, // 日期弹框状态
      date: '', // 日期
      examineList: [], //单据审批列表
      pageSize: 10,
      pageNum: 1,
      allNumber: 0,
      total: 0,
      totalPages: 0
    },
    created: function () {
      this.getExamineList() //单据审批
      // 页面刷新
      window.UpdateExaFn = function () {
        main.examineList = []
        main.pageNum = 1
        main.getExamineList()
      }
    },
    watch: {
      // 如果 `flag` 发生改变，这个函数就会运行
      flag: function () {
        // console.log(this.flag);
        if (this.flag === 1) {
          this.getExamineList() //单据审批
          // 页面刷新
          window.UpdateExaFn = function () {
            main.examineList = []
            main.pageNum = 1
            main.getExamineList()
          }
        } else if (this.flag === 2) {
          this.selectInvoicingList();
          // 页面刷新
          window.UpdateRevFn = function () {
            main.invoicingList = []
            main.pageNum = 1
            main.selectInvoicingList()
          }
        }
      }
    },
    components: { vant },
    methods: {
      // 返回日期
      formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      },
      // 选择日期
      onConfirm(date) {
        this.showDate = false;
        this.date = this.formatDate(date);
      },
      // 打开筛选弹框
      openPopup() {
        this.show = true;
      },
      // 关闭筛选弹框
      closePopup() {
        this.show = false;
      },
      // 获取单据审批列表
      getExamineList() {
        var url = "api/control/beatUser/receiptList";
        var option = {
          data: {
            status: "SuccessApproval",
            userId: _g.getLS("userId"),
            pageSize: this.pageSize,
            pageNum: this.pageNum,
          }
        }
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, '你好')
            main.total = ret.data.total
            main.allNumber = ret.data.allNumber
            main.totalPages = Math.ceil(ret.data.total / main.pageSize);
            main.examineList = main.examineList.concat(ret.data.records)
            // main.examineList = [...main.examineList, ...ret.data.records]
            main.checked = false
          }
        })
      },
      // 打开单据审核详情
      openDetails(id, type) {
        _g.openWin({
          header: { title: "单据详情" },
          name: "index-details",
          url: "../myBills/index_details_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {
            eID: id,
            type: type
          },
        });
      },
      // 获取开票列表
      selectInvoicingList() {
        var url = "/api/control/beatInvoicing/selectBeatInvoicingList";
        var option = {
          page: this.pageNum,
          limit: this.pageSize,
          data: {
            userId: _g.getLS("userId"),
            // userId: "4028818972e587860172e58d3a970001",
          }
        }
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            // console.log(ret);
            main.total = ret.data.total
            main.totalPages = ret.data.pages;
            main.invoicingList = ret.data.list;
          }
        })
      },
      // 打开开票详情
      openInvoicingDetails(id) {
        /*  _g.openWin({
           header: { title: "单据详情" },
           name: "index-details",
           url: "../myBills/index_details_frame.html",
           bounces: false,
           slidBackEnabled: false,
           bgColor: "#fff",
           pageParam: {
             eID: id,
             type: type
           },
         }); */
      },
      // 切换开票
      handleTab(val) {
        if (this.flag === val) return;
        this.flag = val;
        // _g.toast('功能暂未开放')
      }
    },
    filters: {
      // 单据类型过滤器
      billFilter(value) {
        if (value === 'INVOICE') {
          return '发票'
        } else if (value === 'BANK') {
          return '银行'
        } else if (value === 'CUSTOMS') {
          return '海关'
        } else if (value === 'FINANCIAL') {
          return '财政'
        } else if (value === 'Other') {
          return '手工单据'
        } else if (value === 'SaleGoods') {
          return '销货单'
        } else if (value === 'Stock') {
          return '进货单'
        }
      },
      formatDate(date) {
        if (!date) {
          return "";
        } else {
          var a = new Date(date).Format("yyyy-MM-dd");
          return a;
        }
      },
    },
  });
  _g.setPullDownRefresh(function () {
    if (main.flag === 1) {
      main.pageNum = 1
      main.examineList = []
      main.getExamineList()
    } else if (main.flag === 2) {
      main.pageNum = 1
      main.invoicingList = []
      main.selectInvoicingList()
    }
  });
  _g.setLoadmore(10, function () {
    if(main.flag===1){
      if (main.pageNum >= main.totalPages) {
        _g.toast('数据已全部加载')
      } else {
        main.pageNum++
        main.getExamineList()
      }
    }else if(main.flag===2){
      if (main.pageNum >= main.totalPages) {
        _g.toast('数据已全部加载')
      } else {
        main.pageNum++
        main.selectInvoicingList()
      }
    }
  });
  (function () { })();
  module.exports = {};
});

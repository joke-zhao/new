define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("review/review_index_view"),
    data: {
      minDate: new Date(2010, 0, 1), // 日期范围
      checked: false, // 全选状态按钮
      show: false, // 筛选弹框状态
      showDate:false, // 日期弹框状态
      date: '', //单据日期
      total:0, //待审核单据
      allNumber:0, //单据总数量
      totalPages:0,
      pageNum:1,
      pageSize:10,
      ReceiptList: [],
      delIdList:[] // 删除的id数组
    },
    created: function () {
      this.selectReceiptList()
      // 页面刷新
      window.UpdateRevFn = function(){
        main.ReceiptList = []
        main.pageNum = 1
        main.selectReceiptList()
      }
    },
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
      selectReceiptList() {
        var self = this
        var url = "api/control/beatReceipt/list";
        var option = {
          data: {
            status: "ParseFailure,ToAudit,FailureApproval",
            userId: _g.getLS("userId"),
            pageSize:this.pageSize,
            pageNum:this.pageNum,
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
            if(ret.code === 200){
              main.total = ret.data.total
              main.allNumber = ret.data.allNumber
              main.totalPages = Math.ceil(ret.data.total / main.pageSize);
              // main.ReceiptList = [...main.ReceiptList,...ret.data.records]
              main.ReceiptList = main.ReceiptList.concat(ret.data.records)
              main.checked = false
            }
            console.log(main.ReceiptList)
          }
        })
      },
      // 打开单据详情页 详情页点击上方进行不同类型的切换
      openReview(id,type,img) {
        _g.openWin({
          header: { title: "单据详情" },
          name: "index-details",
          url: "../review/index_details_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {
            id:id,
            type:type,
            imgUrl:img
          }, //携参
        });
      },
      checkBtn(){
        console.log('全选按钮状态')
        this.checked = this.ReceiptList.every(function(v){
          return v.flag === true
        })
      },
      // 单个按钮改变
      handleChangeBtn(index){
        console.log('单选啊')
        this.checkBtn()
        
        // return this.ReceiptList[index].flag === true;
      },
      // 全选反选
      handleChangeBox(){
        console.log('触发了全选')
       var self = this
        this.ReceiptList.forEach(function(v){
          return v.flag = self.checked ? true : false
        })
      },
      // 删除单据
     deltReceipt() {
       var self = this
        var url = "api/control/beatReceipt/batchDelete";
        var option = {
          data: self.delIdList
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
            _g.toast(ret.message)
            setTimeout(function(){
              self.ReceiptList = []
              self.pageNum = 1
              self.selectReceiptList()
            },800)
          }
        })
      },
      // 获取删除的单据id
      getDelID(){
        var self = this
        self.delIdList = []
        for(var i = self.ReceiptList.length -1; i >= 0 ; i--){
          if(self.ReceiptList[i].flag){
            console.log(self.ReceiptList[i],'.......')
            self.delIdList.push(self.ReceiptList[i].id)
          }
        }
        if(self.delIdList.length > 0){
          self.deltReceipt()
        }else{
          _g.toast('请选择删除数据')
        }
      },
    },
    components: { vant },
    filters: {
      // 单据类型过滤器
      billFilter(value){
        if(value === 'INVOICE'){
          return '发票'
        }else if(value === 'BANK'){
          return '银行'
        }else if(value === 'CUSTOMS'){
          return '海关'
        }else if(value === 'FINANCIAL'){
          return '财政'
        }else{
          return '识别失败'
        }
      },
      // 状态类型过滤器
      statusFilter(value){
        if(value === 'ParseFailure'){
          return '解析失败'
        }else if(value === 'ToAudit'){
          return '待审核'
        }else if(value === 'FailureApproval'){
          return '审批驳回'
        }
      }
    },
  });
  // 下拉刷新
  _g.setPullDownRefresh(function () {
    main.pageNum = 1
    main.ReceiptList = []
    main.selectReceiptList()
  });
  // 上拉加载更多
  _g.setLoadmore(10,function(){
    if(main.pageNum >= main.totalPages){
      _g.toast('数据已全部加载')
    }else{
      main.pageNum++
      main.selectReceiptList()
    }
  });
  (function () { })();
  module.exports = {};
});

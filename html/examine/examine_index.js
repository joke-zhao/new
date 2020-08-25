define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("examine/examine_index_view"),
    data: {
      minDate: new Date(2010, 0, 1), // 日期范围
      checked:false,
      show: false, // 筛选弹框状态
      showDate:false, // 日期弹框状态
      date:'', // 日期
      examineList:[], //单据审批列表
      batchList:[], // 批量驳回通过列表
      pageSize:10,
      pageNum:1,
      allNumber:0,
      total:0,
      totalPages:0
    },
    created: function () { 
      this.getExamineList() //单据审批
      // 页面刷新
      window.UpdateExaFn = function(){
        main.examineList = []
        main.pageNum = 1
        main.getExamineList()
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
        var url = "api/control/beatReceipt/list";
        var option = {
          data: {
            status: "WaitApproval",
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
            console.log(ret,'你好')
            if(ret.code === 200){
              main.total = ret.data.total
            main.allNumber = ret.data.allNumber
            main.totalPages = Math.ceil(ret.data.total / main.pageSize);
            main.examineList = main.examineList.concat(ret.data.records)
            main.checked = false
            }else{
              _g.toast(ret.message)
            }
          }
        })
      },
      checkBtn(){
        this.checked = this.examineList.every(function(v){
          return v.flag === true
        })
      },
      // 单个按钮改变
      handleChangeBtn(){
        this.checkBtn()
      },
      // 全选反选
      handleChangeBox(){
       var self = this
        this.examineList.forEach(function(v){
          return v.flag = self.checked ? true : false
        })
      },
      // 打开单据审核详情
      openDetails(id,type,img){
        _g.openWin({
          header: { title: "单据详情" },
          name: "index-details",
          url: "../examine/index_details_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {
            eID:id,
            type:type,
            imgUrl:img
          },
        });
      },
      // 批量审批驳回接口
      batchSubmit(){
        var url = "api/control/beatReceipt/batchapproval";
        var option = {
          data: main.batchList
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
            console.log(ret,'你好')
            _g.toast(ret.message)
            setTimeout(function(){
              main.examineList = []
              main.pageNum = 1
              main.getExamineList()
            },800)
          }
        })
      },
      // 获取操作的数据
      getBatchList(statusID){
        var self = this
        this.batchList = []
        for(var i = self.examineList.length -1; i >= 0 ; i--){
          if(self.examineList[i].flag){
            console.log(self.examineList[i],'.......')
            self.batchList.push({
              receiptId:self.examineList[i].id, //单据id
              userId:_g.getLS("userId"), //用户id
              type:self.examineList[i].type, //单据类型
              status:statusID //提交状态
            })
          }
        }
          if(self.batchList.length > 0){
            self.batchSubmit()
          }else{
            _g.toast('请选择操作数据')
          }
      }
    },
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
        }else if(value === 'Other'){
          return '手工单据'
        }
      },
      // 状态类型过滤器
      statusFilter(value){
        if(value === 'WaitApproval'){
          return '待审批'
        }
      }
    },
  });
  _g.setPullDownRefresh(function () {
    main.pageNum = 1
    main.examineList = []
    main.getExamineList()
  });
  _g.setLoadmore(10,function(){
    if(main.pageNum >= main.totalPages){
      _g.toast('数据已全部加载')
    }else{
      main.pageNum++
      main.getExamineList()
    }
  });
  (function () {})();
  module.exports = {};
});

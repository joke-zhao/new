define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require('L/vant/vant.min.js');
  var area = require('U/area')
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("register/register_taxpayer_view"),
    data: {
      showPicker:false,
      count: 0,
      timer: null,
      timer2:null,
      nickName:'',
      codeDesc: "获取验证码",
      phone: "",
      password: "",
      sureNumber: "",
      unitName: "", //公司名称
      id: "1", //页面传递过来的id
      option1: [
        { text: '员工', value: '1' },
        { text: '老板', value: '2' }
      ],
      columns: [], //公司模糊搜索数据
      areaList:{}, //省市区大对象
      show:false, //级联表
      address2:'', //省市区组合
      province: "", //省
      city: "", //市
      county: "", //区
      invitedCode:"", //邀请码
    },
    created: function () {
      this.areaList = area
    },
    filters: {},
    components: { vant },
    methods: {
      handleCancel() {
        this.show = false;
      },
      handleConfirm(e) {
        console.log(e);
        this.province = e[0].name;
        this.city = e[1].name;
        this.county= e[2].name;
        this.address2 = this.province + '-' + this.city + '-' + this.county
        this.show = false;
      },
      // 请求验证码
      handleGetCode() {
        var ePhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (ePhone.test(this.phone)) {
          const TIME_COUNT = 60;

          if (!this.timer) {
            this.count = TIME_COUNT;
            this.getCode();
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                this.codeDesc = `${this.count}s后获取`;
              } else {
                clearInterval(this.timer);
                this.timer = null;
                this.codeDesc = "重新获取";
              }
            }, 1000);
          }
        } else {
          _g.toast("请输入正确手机号码");
        }
      },
      // 获取验证码
      getCode() {
        var url = "api/control/beatUser/sendSms?phoneNumber=" + this.phone;
        Http.ajax({
          url: url,
          data: {},
          method: "post",
          isSync: true,
          isJson: false,
          lock: false,
          success: function (ret) {
            if(ret.code === 200){
              _g.toast('验证码已发送');
            }else{
              _g.toast(ret.message)
            }
          },
        });
      },
      submitReg() {
        var ePhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
        var ePassWord = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/; //密码校验
        if (!ePhone.test(this.phone)) {
          _g.toast("手机号码错误");
        } else if (!this.sureNumber) {
          _g.toast("验证码不能为空");
        } else if (!ePassWord.test(this.password)) {
          _g.toast("密码长度为6~12位，必须包含数字和字母");
        } else if(!this.nickName){
          _g.toast("用户昵称不能为空");
        }else if(!this.unitName){
          _g.toast('公司名不能为空')
        }else if(!this.address2){
          _g.toast('省市区不能为空')
        }else{
          var self = this;
          var url = "api/control/beatUser/addUser";
          var option = {
            data: {
              nickName:this.nickName,
              phone: this.phone,
              passWord: this.password,
              sureNumber: this.sureNumber,
              sysRole: this.id,
              companyName: this.unitName,
              province:this.province,
              city:this.city,
              district:this.county,
              invitedCode:this.invitedCode
            },
          };
          Http.ajax({
            url: url,
            data: option,
            method: "post",
            isSync: true,
            isJson: true,
            lock: false,
            success: function (ret) {
              console.log(ret)
              if (ret.code === 200) {
                _g.toast(ret.data);
                // 注册成功跳回登录界面
                setTimeout(function () {
                  self.openLogin();
                }, 2000);
              } else {
                _g.toast(ret.message);
              }
            },
          });
        }
      },
      // 打开登录界面
      openLogin() {
        _g.openWin({
          name: "login-index",
          url: "../login/index_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {},
        },"normal");
      },
      // 模糊搜索公司
      getBeatCompany(){
        console.log('搜索')
        if(!this.unitName){
          this.showPicker = false
        }else{
        var self = this
        var url = "api/control/beatCompany?name="+this.unitName+"&pageSize=" + 30+"&pageNum=" + 1;
        Http.ajax({
          url: url,
          data: {},
          method: "get",
          isSync: true,
          // isJson: true,
          lock: false,
          success: function (ret) {
            console.log(ret,'公司数据')
            self.columns = []
            if(ret.code === 200){
              ret.data.records.forEach(function(v){
                self.columns.push(v.name)
              })
              if(self.columns.length == 0){
                _g.toast('暂无该公司数据')
              }else{
                self.showPicker = true
              }
            }
          }
        });
        }
      },
      delayed(){
        if(this.timer2){
            clearTimeout(this.timer2)
            this.timer2=null
        }
        this.timer2=setTimeout(()=>{
          main.getBeatCompany()
        },1200)
    },
      onConfirm(value) {
        this.unitName = value;
        this.showPicker = false;
      },
    },
  });
  (function () {})();
  module.exports = {};
});

define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/enterStaff_auth_view"),
    data: {
      flag: 1, //切换标识
      name: "",
      photo: "",
      id: "", // 员工id
      staffList: [], // 权限列表
      delShow: false, //剔除弹框
      roleStatus:true, //权限禁止状态 - 员工不能修改员工权限
    },
    created: function () {
      if(_g.getLS('roleId') != 1){
        // 不为纳税人员工的话 均可以修改权限
        this.roleStatus = false
      }
      this.id = api.pageParam.staffId;
      this.getStaffInfo();
      this.getUserInfo()
    },
    filters: {},
    methods: {
      handleTab(val) {
        if (this.flag === val) return;
        this.flag = val;
      },
      //   获取员工信息
      getStaffInfo() {
        var self = this;
        var url = "api/control/beatCompany/staffInfo";
        var options = {
          data: {
            bossId: _g.getLS("userId"),
            userId: this.id,
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
            console.log(ret, "/???");
            if (ret.code === 200) {
              main.staffList = ret.data;
            } else {
              _g.toast(ret.message);
            }
          },
        });
      },
      //   获取用户信息
      getUserInfo() {
        var self = this;
        var url = "api/control/beatUser/userInfo";
        var options = {
          data: {
            userId: this.id,
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
            console.log(ret, "用户信息");
            if (ret.code === 200) {
              main.name = ret.data.nickname
              main.photo = ret.data.photoUrl
            }
          },
        });
      },
      //   点击更改员工操作权限
      changeBtn1(val){
        console.log(val,'操作权限')
        this.changeStaffInfo(val.id,'',val.operatePermission,1)
      },
      //   点击更改员工数据权限
      changeBtn2(item,item2){
        console.log(item,'数据权限')
        console.log(item2,'数据权限')
        this.changeStaffInfo(item.id,item2.name,item2.enable,2)
      },
      //   更改员工数据权限
      changeStaffInfo(id,name,enable,type){
        var self = this;
        var url = "api/control/beatCompany/editPermission";
        var options = {
          data: {
            id:id,
            name:name,
            permission:enable,
            type:type
          },
        };
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: true,
          url: url,
          success: function (ret) {
              _g.toast(ret.message);
          },
        });
      },
      // 点击剔除
      handleDelShow(){

        if(this.roleStatus){
          _g.toast('权限不足，无法剔除')
        }else{
          this.delShow = true
        }
      },
      //  点击确认剔除员工
      handleDel() {
          this.delShow = false;
          this.delStaffInfo()
      },
      //   剔除员工
      delStaffInfo() {
        var self = this;
        var url = "api/control/beatCompany/removeStaff";
        var options = {
          data: {
            bossId: _g.getLS("userId"),
            userId: this.id,
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
            console.log(ret, "/???");
            _g.toast(ret.message)
            if (ret.code === 200) {
             setTimeout(function(){
              api.closeWin()
              _g.execScript({
                winName: "index-enterStaff-win",
                frameName: "index-enterStaff-frame",
                fnName: "UpdataStaffFn",
              });
             },800)
            }
          },
        });
      },
    },
    components: {
      vant,
    },
  });

  (function () {})();
  module.exports = {};
});

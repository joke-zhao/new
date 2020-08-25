define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('mySet/index_enterStaff_view'),
        data: {
          staffList:[], // 员工列表
        },
        created: function () {
          window.UpdataStaffFn = function(){
            main.getStaff()
          }
          this.getStaff() //老板获取员工列表
        },
        filters: {

        },
        methods:{
            // 打开员工权限页面
            openAuth(id,roleID){
                if(roleID === '1' || roleID === '3'){
                  _g.openWin({
                    header:{title:'员工权限'},
                    name:"enterStaff-auth",
                    url:"../mySet/enterStaff_auth_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{
                      staffId:id
                    } //携参
                })
                }else{
                  _g.toast('无法查看老板权限')
                }
            },
            // 获取老板下的所有企业员工
            getStaff(){
                var self = this;
        var url = "api/control/beatCompany/companyStaff";
        var options = {
          data:{
            userId:_g.getLS('userId'),
          }
        }
        Http.ajax({
          data: options,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            if(ret.code === 200){
              main.staffList = ret.data
              if(main.staffList === 0){
                _g.toast('暂无员工数据')
              }
            }else{
              _g.toast(ret.message)
            }
            
          },
        });
            }
        }
    });

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {});
        }
    };

    (function () {

    })();
    module.exports = {};
});

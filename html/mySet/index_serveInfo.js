define(function (require, exports, module) {
  var Http = require("U/http");
  var swiper = require("L/swiper/swiper.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("mySet/index_serveInfo_view"),
    data: {
      serverList:[],
      userInfo: {},
      userName: "",
      sign: "", //签名
      photoUrl:'', //头像
      introduction:'', //个人简介
      /* -------- */
      seniority:'', //工龄
      serveId:'', //服务id
      serverAddress:'', //服务地址
      status:'', //资质认证状态
      imgUrlStr:'', //资质认证图片地址 分号分隔
      serverType:'', //服务类型id

    },
    created: function () {
      this.getServeInfo()
      // 更新签名状态的函数
      window.UpdateSignFn = function () {
        main.sign = _g.getLS("userSign");
        if (main.sign) {
          main.sign = "已签名，可点击修改";
        } else {
          main.sign = "未签名，请点击设置";
        }
      },
      // 更新服务标签的函数 - 没意义的++
      window.UpdateServerTypeFn = function (data) {
        main.serverType = data.selectTagList.toString()
        console.log(main.serverType,'哈哈哈哈哈')
      },
      // 资质认证 - 没意义的++
      window.UpdateAcUrlFn = function (data) {
        main.imgUrlStr = data.AcUrl
        if(main.imgUrlStr){
          main.status = 1
        }else{
          main.status = 0
        }
      },
      this.sign = _g.getLS("userSign");
      this.userName = _g.getLS("nickName");
      this.photoUrl = _g.getLS("photoUrl");
      this.introduction = _g.getLS("introduction");
      if (this.sign) {
        this.sign = "已签名，可点击修改";
      } else {
        this.sign = "未签名，请点击设置";
      }
      console.log(this.sign, "ddd");
    },
    filters: {},
    methods: {
      // 选择图片上传
      submitImg() {
        var UIAlbumBrowser = api.require('UIAlbumBrowser');
                UIAlbumBrowser.open({
                  max:1,
                    styles: {
                        bg: '#fff',//（可选项）字符串类型；资源选择器背景，支持 rgb，rgba，#；默认：'#FFFFFF'
                        mark: {//（可选项）JSON对象；选中图标的样式
                            icon: '', //（可选项）字符串类型；图标路径（本地路径，支持fs://、widget://）；默认：对勾图标
                            position: 'top_right',//（可选项）字符串类型；图标的位置，默认：'bottom_left'
                            // 取值范围：
                            // top_left（左上角）
                            // bottom_left（左下角）
                            // top_right（右上角）
                            // bottom_right（右下角）
                            size: 20//（可选项）数字类型；图标的大小；默认：显示的缩略图的宽度的三分之一
                        },
                        texts: {
                            stateText: '已选择*项',
                            cancelText: '取消',
                            finishText: '完成'
                        },
                        nav: {                              //（可选项）JSON对象；导航栏样式
                            bg: 'rgba(0,0,0,1)',                     //（可选项）字符串类型；导航栏背景，支持 rgb，rgba，#；默认：'#eee'
                            stateColor: '#fff',             //（可选项）字符串类型；状态文字颜色，支持 rgb，rgba，#；默认：'#000'
                            stateSize: 18,                  //（可选项）数字类型；状态文字大小，默认：18
                            cancelBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；取消按钮背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            cancelColor: '#fff',            //（可选项）字符串类型；取消按钮的文字颜色；支持 rgb，rgba，#；默认：'#000'
                            cancelSize: 16,                 //（可选项）数字类型；取消按钮的文字大小；默认：18
                            finishBg: 'rgba(0,0,0,0)',      //（可选项）字符串类型；完成按钮的背景，支持 rgb，rgba，#；默认：'rgba(0,0,0,0)'
                            finishColor: '#fff',            //（可选项）字符串类型；完成按钮的文字颜色，支持 rgb，rgba，#；默认：'#000'
                            finishSize: 16                  //（可选项）数字类型；完成按钮的文字大小；默认：18
                        }
                    },
                    rotation: true
                }, function (ret) {
                    if (ret.eventType === "cancel") {
                        _g.toast("您取消了上传哦~")
                    }
                    if (ret.eventType === "confirm") {
                        var url = "upload/storageObj?type=1";
                        var filePaths = ret.list[0].path;
                        Http.ajax({
                            data: { file: filePaths },
                            isFile: true,
                            isJson: false,
                            method: "post",
                            isSync: true,
                            lock: false,
                            url: url,
                            success: function (ret) {
                                if (ret.code == 200) {
                                 main.photoUrl = ret.data.realPath
                                }else{
                                  _g.toast(ret.message)
                                }
                            }
                        })
                    }
                });
      },
      // 打开签名
      openSignature() {
        _g.openWin({
          header: { title: "电子签名" },
          name: "signature",
          url: "../mySet/signature_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开服务类型
      openServrType(){
        _g.openWin({
          header: { title: "服务类型" },
          name: "serveInfo-type",
          url: "../mySet/serveInfo_type_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {}, //携参
        });
      },
      // 打开资质认证
      openAC(){
        _g.openWin({
          header: { title: "资质认证" },
          name: "serveInfo-AC",
          url: "../mySet/serveInfo_AC_frame.html",
          bounces: false,
          slidBackEnabled: false,
          bgColor: "#fff",
          pageParam: {
            AcUrl:main.imgUrlStr
          }, //携参
        });
      },
      // 更新用户信息
      submit() {
        var roleId = Number(_g.getLS("roleId"));
        var winName = "main-index-win";
        if (roleId === 2) {
          // winName = 'mainBoss-index-win'
          winName = "main-indexBoss-win"; // 0722-杨标泓改
        }
        /* 因为我们存在两个main，故做以上判断 */
        var self = this;
        var url = "api/control/beatUser/updateServerInfo";
        var option = {
          data: {
            userId: _g.getLS("userId"),
            nickName: self.userName,
            photoUrl:self.photoUrl,
            introduction:self.introduction,
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的数据");
            if (ret.code === 200) {
              _g.setLS("nickName", ret.data.nickname);
              _g.setLS('photoUrl',ret.data.photoUrl)
              _g.setLS('introduction',ret.data.introduction)
              main.upDataServeInfo() //更新服务商信息
              _g.toast(ret.message);
              setTimeout(function () {
                api.closeWin();
                _g.execScript({
                  winName: winName,
                  frameName: "my-index-frame",
                  fnName: "UpdateNameFn",
                });
              }, 800);
            }
          },
        });
      },
      // 根据用户id获取服务商信息接口 - 获取到的服务id在更新信息的时候需要
      getServeInfo(){
        var self = this
        var url = "api/control/beatFreelanceInfo/selectBeatFreelanceInfo";
        var option = {
          data: {
            id: _g.getLS("userId"),
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的数据");
            if (ret.code === 200) {
              main.seniority = ret.data.seniority
              main.serveId = ret.data.id
              main.serverAddress = ret.data.serverAddress
              main.status = ret.data.status
              main.imgUrlStr = ret.data.imgUrl
              main.serverType = ret.data.serverType
              main.initServerType()
            }
          },
        });
      },
      // 更新服务商信息 --- mdzz不要问我 我不知道我不知道我不知道-没意义的东西还展示个草拟吗
      upDataServeInfo(){
        var url = "api/control/beatFreelanceInfo/updateBeatFreelanceInfo";
        var option = {
          data: {
            id:main.serveId,
            seniority:main.seniority,
            userId: _g.getLS("userId"),
            serverAddress:main.serverAddress,
            status:main.status,
            imgUrl:main.imgUrlStr,
            serverType:main.serverType
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的数据");
            if (ret.code === 200) {}
          },
        });
      },
      // 服务标签字符遍历找到名字渲染 - 
      initServerType(){
        if(this.serverType){
          var serverNameList = this.serverType.split(",")
          console.log(serverNameList)
          serverNameList.forEach(function(i){
          main.getServerName(i)
        })
        }
      },
      // 根据serverType字符串找到服务标签名
      getServerName(serverId){
        var url = "api/control/beatLabel/selectBeatLabel";
        var option = {
          data: {
            id: serverId,
          },
        };
        Http.ajax({
          data: option,
          isFile: false,
          isJson: true,
          method: "post",
          isSync: true,
          lock: false,
          url: url,
          success: function (ret) {
            console.log(ret, "获取到的数据");
            if (ret.code === 200) {
              main.serverList.push(ret.data.type)
            }
          },
        });
      }
    },
  });

  (function () {})();
  module.exports = {};
});

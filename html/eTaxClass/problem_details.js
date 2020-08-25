define(function (require, exports, module) {
  var Http = require("U/http");
  var vant = require("L/vant/vant.min.js");
  var main = new Vue({
    el: "#main",
    template: _g.getTemplate("eTaxClass/problem_details_view"),
    data: {
      friendList: [],//账友回答列表
      problems: [],//问题详情
      getall: 0,
      focusLabel: "关注问题",//关注标签
      exceptional: '',//积分打赏输入框
      show: false,//积分遮罩层
      show2: false,//回答遮罩层
      show3: false,//评论遮罩层
      buserId: "",//积分接收方userid
      writeAnswer: "",//回答输入框
      replyId: "",//回答内容的id
      comments: "",//评论输入框
      comment_list: false,//回答的评论  子级 vshow
      ReplyIndex:0,//展开的评论
      ReplyList:[],//展开评论的List
      moreImg:1,//展开的图片  1为展开  2为收缩
    },
    created: function () {
      this.selectProblemDetails();
      this.selectFriendReplied();
    },
    components: {
      vant,
    },
    methods: {
      //根据问题id查问题详情
      selectProblemDetails() {
        var url = "api/control/beatProblem/viewBeatProblem";
        var option = {
          data: {
            id: api.pageParam.proId,
            userId: _g.getLS("userId")
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: false,
          success: function (ret) {
            if (ret.code === 200) {
              main.problems = ret.data;//账友回答列表
              if(ret.data.status === 1){//1.已关注  2未关注
                main.focusLabel = "已关注"
              }else{
                main.focusLabel = "关注问题"
              }
            }
          }
        })
      },

      //根据问题id查账友回答
      selectFriendReplied() {
        var url = "api/control/beatReply/viewBeatReply";
        var option = {
          data: {
            id: api.pageParam.proId,
            userId: _g.getLS("userId")
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: false,
          success: function (ret) {
            if (ret.code === 200) {
              main.friendList = ret.data;//账友回答列表
            }
          }
        })
      },

      //点赞
      createBeatUserLike(id) {
        var url = "api/control/beatUserLike/createBeatUserLike";
        var option = {
          data: {
            likeId: id,//被点赞的id 如电子书id或课程id回答id智能id等
            type: 3,//1课程 2电子书 3回答id 4智能
            userId: _g.getLS("userId")
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: false,
          isJson: true,
          lock: true,
          success: function (ret) {
            main.selectFriendReplied();
          }
        })
      },
      //写回答
      createWriteAnswer() {
        if (main.writeAnswer != "") {
          var url = "api/control/beatReply/createBeatReply";
          var option = {
            data: {
              content: main.writeAnswer,
              createTime: new Date(),
              problemId: api.pageParam.proId, //问题id
              senderName: _g.getLS("nickName"),
              senderPhoto: _g.getLS("photoUrl"),
              start: 0,
              sum: 0,
              type: 2,//回答人类型,1智能回答,2用户回答
              userId: _g.getLS("userId"),

            }
          }
          Http.ajax({
            url: url,
            data: option,
            method: 'post',
            isSync: true,
            isJson: true,
            lock: true,
            success: function (ret) {
              if (ret.code === 200) {
                main.writeAnswer = "";
                main.show2 = false;
                main.selectFriendReplied();//重新查询回答
                _g.toast("回答成功!");
              }
            }
          })
        } else {
          _g.toast("请输入回答内容！")
        }
      },
      // 查询回答的评论
      selectCommentReply(replyId,index) {
        if (this.comment_list === false) {
          this.ReplyIndex = index;
          this.moreImg = 2;
          this.comment_list = true;
          var url = "api/control/beatCommentReply/viewBeatCommentReply";
          var option = {
            data: {
              id: replyId, //回答内容的id
            }
          }
          Http.ajax({
            url: url,
            data: option,
            method: 'post',
            isSync: false,
            isJson: true,
            lock: false,
            success: function (ret) {
              if(ret.code === 200){
                main.ReplyList = ret.data;
                if(ret.data.length===0){
                  main.comment_list = false;
                  main.moreImg = 1;
                }
              }
              
            }
          })
        } else {
          this.comment_list = false;
          this.moreImg = 1;
        }
      },

      //发表回答的评论
      createComments() {
        if (main.comments != "") {
          var url = "api/control/beatCommentReply/createBeatCommentReply";
          var option = {
            data: {
              content: main.comments,
              createTime: new Date(),
              replyId: this.replyId, //回答内容的id
              senderName: _g.getLS("nickName"),
              senderPhoto: _g.getLS("photoUrl"),
              userId: _g.getLS("userId"),
            }
          }
          Http.ajax({
            url: url,
            data: option,
            method: 'post',
            isSync: true,
            isJson: true,
            lock: true,
            success: function (ret) {
              if (ret.code === 200) {
                main.comments = "";
                main.show3 = false;
                _g.toast("评论成功!");
              }
            }
          })
        } else {
          _g.toast("请输入要评论的内容！")
        }
      },
      //根据不同情况出现不同弹窗
      popupExceptional(Id, index) {//index: 1.为打赏积分  2.为写回答   3.为评论
        if (index === 1) {
          this.show = true;
          this.buserId = Id //此Id为userId
        }
        if (index === 2) {
          this.show2 = true;
        }
        if (index === 3) {
          this.show3 = true;
          this.replyId = Id //此id为replyId 回答内容的id
        }
      },
      // 打赏积分
      sendIntegral() {
        var url = "api/control/beatPointsRecord/sendIntegral";
        var option = {
          data: {
            aid: _g.getLS("userId"),//打赏方userid
            bid: this.buserId,//接收方userid
            size: this.exceptional//输入的积分
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: true,
          isJson: true,
          lock: true,
          success: function (ret) {
            if (ret.code === 200) {
              main.show = false;//关闭弹窗
              main.exceptional = "";//清除输入数据
              _g.toast("打赏成功啦~")
            }
          }
        })
      },
      // 关注问题
      createBeatConcern() {
        var url = "api/control/beatConcern/createBeatConcern";
        var option = {
          data: {
            problenId: api.pageParam.proId,//问题id
            userId: _g.getLS("userId"),
          }
        }
        Http.ajax({
          url: url,
          data: option,
          method: 'post',
          isSync: true,
          isJson: true,
          lock: true,
          success: function (ret) {
            if (ret.code === 200) {
              if(ret.data === true){
                main.focusLabel = "已关注";
              }
              if(ret.data === "取消关注成功"){
                main.focusLabel = "关注问题";
              }
            }
          }
        })
      },
      getAll(index) {
        if (this.friendList[index].id === 0) {
          this.friendList[index].id = 1
        } else {
          this.friendList[index].id = 0
        }
      },
      getReplyAll(index) {
        if (this.ReplyList[index].id === 0) {
          this.ReplyList[index].id = 1
        } else {
          this.ReplyList[index].id = 0
        }
      },
    },
    filters: {
      formatDate(date) {
        if (!date) {
          return '暂无时间';
        } else {
          var a = new Date(date).Format("yyyy-MM-dd hh:mm:ss")
          return a
        }
      },
    },
  });

  (function () { })();
  module.exports = {};
});

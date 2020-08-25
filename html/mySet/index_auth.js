define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('mySet/index_auth_view'),
        data: {
            fileList:[],
            imageList: [],
        },
        created: function () {

        },
        filters: {

        },
        methods:{
            onOversize(file) {
                console.log(file);
                _g.toast('文件大小不能超过 5MB');
            },
            //文件上传
            afterRead(file) {
                if(main.fileList.length==0){
                    _g.toast("图片为空")
                }else {
                    main.fileList.forEach(item=>{
                        let form = new FormData()
                        form.append('file',item.file)
                        let uploadFile = axios.create({
                            baseURL:"http://8.129.223.18:5200/",
                            headers:{"Content-Type": "multipart/form-data;boundary ="+ new Date().getTime()}
                        })
                        uploadFile({
                            method: "post",
                            url: "upload/storageObj?type=1",
                            data: form
                        }).then(result => {
                            let data = result.data
                            if (data.code === 200) {
                                this.imageList.push(data.data.realPath)
                                _g.toast("提交成功!恭喜您成功入驻，快去接单吧")
                                setTimeout(() => {
                                    main.openJoin();
                                }, 2000);
                            }else{
                                _g.toast("上传失败")
                            }
                        })
                    })
                }
            },
            beforeDelete(params,obj) {
                this.imageList.splice(obj.index,1)
                return true
            },
            //入驻
            submit(){
                console.log(this.fileList);
            },
            openJoin(){
                _g.openWin({
                    header:{title:'我要合作'},
                    name:"cooperation-index",
                    url:"../cooperation/cooperation_index_frame.html",
                    bounces:false,
                    slidBackEnabled:false,
                    bgColor:'#fff',
                    pageParam:{} //携参
                })
            }
        }
    });

    (function () {

    })();
    module.exports = {};
});

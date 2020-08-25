define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('mySet/index_enterInfo_view'),
        data: {
            //公司名
            deptId: '',
            companyName: '',
            companyId: '',
            userId: '',
            name: '',
            index: 1,//选中的下标
            basic: true,//基本情况
            stocks: false,//股东情况
            tax: false,//报税密码
            //公司logo
            // logoUrl: [],
            logoUrlList: [],
            logoUrl: '',
            companySummary: '',
            //服务地址
            serverAddress: '请选择服务地址',
            longitude: '',
            latitude: '',
            //    行业选择
            showCompanyType: false,
            companyTypeList: [],
            companyType: '请选择企业类型',
            showIndustrys: false,
            showIndustrys2: false,
            industrys: ['贸易类', '制造类', '研发类', '服务类', '其他'],
            // industry: '请选择所属行业',
            industry2: '请选择行业类型',
            industrysType: [],
            //!所属行业
            value3: "",
            industryPicker: false,
            timer2: null,
            industry: [],
            //    服务类型
            selectTypeList: [],
            serverType: '',
            serverTypeName: '',
            //    2个密码
            isShow: false,
            isShow2: false,
            password1: '',
            password2: '',
            //纳税人选择
            isShowTrue: true,
            isShowTrue2: false,
            taxer: 1,
            //上传图片  显示图片url缩略图
            fileList: [],
            fileList2: [],
            businessUrl: '',   //营业执照url地址
            //选择公司
            showCompany: false,
            company: '',   //股东情况-选择公司
            companyList: [],
            isShareholder: false,
            shareholder: '',
            holderList: [],
            roleId: '',    //用户角色
            legalPeople: '',   //法人
            otherUrl: '',  //资质照片
        },
        created: function () {
            //获取地图
            window.fnNameMap = function (data) {
                // _g.alert(data)
                console.log(data.address)
                console.log(data.lon)
                console.log(data.lat)
                console.log(data.id)
                main.serverAddress = data.address;
                main.longitude = data.lon;
                main.latitude = data.lat;
            };

            //只能手机端使用   获取服务标签
            window.fnName = function (data) {
                let typeList = data.selectTypeList
                var arr = []
                var arrName = []
                typeList.forEach(item => {
                    arr.push(item.id)
                    arrName.push(item.name)
                })
                main.serverType = arr.join()
                main.selectTypeList = arrName
                main.serverTypeName = arrName.join()
            };
            //改
            // this.companyName = '广州数信区块链科技有限公司';
            this.deptId = _g.getLS("deptId");
            this.companyName = _g.getLS("companyName");
            this.roleId = Number(_g.getLS('roleId'))
            this.userId = _g.getLS("userId")

            // this.deptId = 'A1000064';
            // this.companyName = '公司池公司'
            // this.name = '公司池公司';
            // this.roleId = '2'
            // this.userId = '2c9274f6738f482101738f637d5710f2'
            console.log(this.deptId + "," + this.companyName + "," + this.roleId + "," + this.userId)
            this.viewInfo()
            // //显示该用户的公司列表
            this.handleCompany()
            this.queryCompanyType()
            //获取公司ID
            this.selectCompanyByName()
        //    显示股东列表
            this.selectStockholder()
        },
        filters: {},
        methods: {
            //查询企业类型
            queryCompanyType() {
                var url = 'api/control/beatCompanyType/list'
                var option = {
                    data: {}
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            main.companyTypeList = []
                            ret.data.forEach(item => {
                                main.companyTypeList.push(item.name)
                            })
                        }
                    },
                });

            },
            //加载基本情况
            viewInfo() {
                var url = 'api/control/beatCompany/viewInfo'
                var option = {
                    "data": {
                        //改
                        // "userId": '2c9274f67370bbe50173744d653e0028'
                        "userId": this.userId
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            console.log(ret.data, "viewINFO");
                            // alert(ret.data)
                            var statusList = ret.data[0]
                            main.companyName = statusList.name
                            main.name = statusList.name   //公司名
                            main.companySummary = statusList.introduction //简介
                            main.logoUrlList = []  //logo
                            main.logoUrlList.push({
                                url: statusList.logoUrl
                            })  //logo
                            main.logoUrl = statusList.logoUrl//logo
                            main.selectTypeList = statusList.serverTypeName.split(",")
                            console.log(main.selectTypeList, "selectTypeList");
                            main.serverAddress = statusList.serverAddress  //服务地址
                            main.companyName = statusList.name
                            main.companyType = statusList.companyType   //企业类型
                            main.legalPeople = statusList.legalPeople   //法人姓名
                            main.taxer = statusList.taxpayerType  //纳税人类型
                            main.value3 = statusList.industryId   //所属行业
                            main.industry2 = statusList.industryTypeId  //行业类型
                            main.fileList = []
                            main.businessUrl = statusList.businessUrl
                            main.fileList.push({
                                url: statusList.businessUrl
                            })  //营业执照
                            main.otherUrl = statusList.otherUrl   //其他资质
                            main.fileList2 = statusList.otherUrl.split(',');  //其他资质
                            main.fileList2 = main.fileList2.map(item => {
                                return {
                                    url: item
                                }
                            })
                        }
                        console.log(ret, "viewInfo");
                    },
                });
            },
            checkTaxer(taxer) {
                this.isShowTrue = !this.isShowTrue
                this.isShowTrue2 = !this.isShowTrue2
                if (this.isShowTrue == true) {
                    this.taxer = 1
                } else {
                    this.taxer = 2
                }
            },
            onConfirm(value, index) {
                this.industry = value
                this.showIndustrys = false
            },
            onConfirm2(value, index) {
                this.industry2 = value
                this.showIndustrys2 = false
            },
            onChange(picker, value, index) {

            },
            onCancel() {
                this.showIndustrys = false
            },
            //跳转服务类型标签
            onServiceType() {
                _g.openWin({
                    header: {},
                    name: "index-enterInfo-serviceType",
                    url: "../serviceType/serviceType_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })


            },
            //显示基本情况
            showBasic() {
                this.index = 1;
                this.basic = true;
                this.stocks = false;
                this.tax = false;
                this.viewInfo()
            },
            //显示股东情况
            showStocks() {
                this.index = 2;
                this.basic = false;
                this.stocks = true;
                this.tax = false;
            },

            //显示报税密码
            showTax() {
                this.index = 3;
                this.basic = false;
                this.stocks = false;
                this.tax = true;
            },
            //    报税密码弹出框
            onPassword() {
                vant.Dialog.alert({
                    title: '标题',
                    message: '弹窗内容',
                    theme: 'round-button',
                }).then(() => {
                    // on close
                });
            },
            onOversize(file) {
                _g.toast('文件大小不能超过 5M');
            },
            onCompany(value, index) {
                this.company = value
                this.showCompany = false
            },
            //提交
            submit() {
                console.log(main.value3);
                if (!main.companySummary) {
                    _g.toast("公司简介不能为空");
                } else if (!main.companyType) {
                    _g.toast('企业类型不能为空')
                } else if (!main.value3) {
                    _g.toast('所属行业不能为空')
                } else if (!main.industry2) {
                    _g.toast('行业类型不能为空')
                } else if (!main.fileList) {
                    _g.toast('企业执业执照不能为空')
                }
                // else if(!main.fileList2){
                //     _g.toast('其他资质不能为空')
                // }
                // else {
                //改
                // var bMap = api.require("bMap");
                // bMap.getCoordsFromName(
                //     {
                //         serverAddress: main.serverAddress,
                //     },
                //     function (ret, err) {
                //         if (ret.status) {
                var url = "api/control/beatCompany/updateInfo";
                var userId = this.userId;
                var option = {
                    data: {
                        id: main.companyId,
                        name: main.name,   //公司名
                        deptId: main.deptId, //部门
                        introduction: main.companySummary,   //简介
                        serverAddress: main.serverAddress,  //服务地址
                        companyType: main.companyType,    //企业类型
                        // 服务类型标签
                        serverType: main.serverType,    //服务类型id;号分隔
                        serverTypeName: main.selectTypeList.toString(),
                        comType: main.companyType, //企业类型
                        legalPeople: main.legalPeople,  //法人姓名
                        taxpayerType: main.taxer, //纳税人类型
                        industryId: main.value3, //所属行业类型
                        industryTypeId: main.industry2, //行业类型id
                        userId: main.userId,
                        // longitude: ret.lon, //经度
                        // latitude: ret.lat, //纬度
                        logoUrl: main.logoUrl,  //公司logo
                        businessUrl: main.businessUrl,  //营业执照
                        otherUrl: main.otherUrl,
                        longitude: main.longitude,//经度
                        latitude: main.latitude,//纬度
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
                        if (ret.code == 200) {
                            _g.toast("保存成功");
                            // setTimeout(function () {
                            //     api.closeWin();
                            //
                            // }, 800);

                        } else {
                            _g.toast("保存失败");
                        }
                    },
                });
                // } else {
                //     _g.toast('请填写正确地址')
                // }
                // }
                // );
                // }
            },
            /**
             * 新增股东
             */
            //查询股东列表
            selectStockholder() {
                var url = 'api/control/beatShareholder/selectStockholderList'
                var option = {
                    data: {
                        //改
                        // userId: '2c9274f6737ef5ab0173801073db004a'
                        "userId": this.userId
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            main.holderList = ret.data
                        }
                    },
                });

            },
            //    新增按钮判断是否已经选择公司
            openShareholder(){
                if(main.company===''){
                    _g.toast("请先选择公司名称")
                }else{
                    main.isShareholder=true
                }
            },
            //先查询公司ID
            selectCompanyByName() {
                var url = 'api/control/beatCompany/selectCompanyByName'
                var option = {
                    data: {
                        "company": this.companyName,
                        "userId": this.userId
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            main.companyId = ret.data.id
                            console.log(main.companyId+"，companyId");
                        } else {
                            _g.toast("该用户不在该公司，查询失败")
                        }
                    },
                });
            },
            //新增股东  插入股东
            insertStockholder() {
                this.selectCompanyByName()
                var url = 'api/control/beatShareholder/insertStockholder'
                var option = {
                    data: {
                        "companyId": main.companyId,
                        "userName": main.shareholder
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            _g.toast("新增成功")
                            main.userName=''
                            main.selectStockholder()
                        } else {
                            _g.toast(ret.message)
                        }
                    },
                });
            },
            //显示该用户下的所有公司
            handleCompany() {
                var url = 'api/control/beatCompany/handleCompany'
                var option = {
                    data: {
                        // "userId": "2c9274f6737ef5ab0173801073db004a"
                        "userId": this.userId
                    }
                }
                Http.ajax({
                    url: url,
                    data: option,
                    method: "post",
                    isSync: false,
                    isJson: true,
                    lock: false,
                    success: function (ret) {
                        if (ret.code == 200) {
                            ret.data.forEach(itme => {
                                main.companyList.push(itme.name)
                            })
                        } else {
                            _g.toast(ret.message)
                        }
                    },
                });

            },
            //确定企业类型
            onConfirmCompany(value, index) {
                this.companyType = value
                this.showCompanyType = false
            },
            //文件上传   营业执照
            afterRead(file) {
                console.log(main.fileList, "main.fileList");
                main.fileList.forEach(item => {
                    let form = new FormData()
                    form.append('file', item.file)
                    let uploadFile = axios.create({
                        baseURL: "http://8.129.223.18:5200/",
                        headers: {"Content-Type": "multipart/form-data;boundary =" + new Date().getTime()}
                    })
                    uploadFile({
                        method: "post",
                        url: "upload/storageObj?type=1",
                        data: form
                    }).then(result => {
                        let data = result.data
                        if (data.code === 200) {
                            main.businessUrl = data.data.realPath
                            _g.toast("上传成功")
                        } else {
                            _g.toast("上传失败")
                        }
                    })
                })

            },
            //文件上传   资质
            afterReadZz(file) {
                var otherUrlList = []
                main.fileList2.forEach(item => {
                    let form = new FormData()
                    form.append('file', item.file)
                    let uploadFile = axios.create({
                        baseURL: "http://8.129.223.18:5200/",
                        headers: {"Content-Type": "multipart/form-data;boundary =" + new Date().getTime()}
                    })
                    uploadFile({
                        method: "post",
                        url: "upload/storageObj?type=1",
                        data: form
                    }).then(result => {
                        let data = result.data
                        if (data.code === 200) {
                            otherUrlList.push(data.data.realPath)
                            main.otherUrl = otherUrlList.toString()

                            _g.toast("上传成功")
                        } else {
                            _g.toast("上传失败")
                        }
                    })
                })
            },
            //文件上传   公司头像
            afterReadLogo(file) {
                let form = new FormData()
                form.append('file', this.logoUrlList[0].file)
                let uploadFile = axios.create({
                    baseURL: "http://8.129.223.18:5200/",
                    headers: {"Content-Type": "multipart/form-data;boundary =" + new Date().getTime()}
                })
                uploadFile({
                    method: "post",
                    url: "upload/storageObj?type=1",
                    data: form
                }).then(result => {
                    let data = result.data
                    if (data.code === 200) {
                        main.logoUrl = data.data.realPath
                        _g.toast("上传成功")
                    } else {
                        _g.toast("上传失败")
                    }
                })
            },
            //    所属行业，模糊搜索
            onIndustry(value) {
                this.value3 = value;
                this.industryPicker = false;
            },
            delayed2() {
                if (this.timer2) {
                    clearTimeout(this.timer2);
                    this.timer2 = null;
                }
                this.timer2 = setTimeout(() => {
                    main.getindustry();
                }, 1200);
            },
            // 模糊搜索行业类型
            getindustry() {
                console.log("搜索");
                if (!this.value3) {
                    this.industryPicker = false;
                } else {
                    var self = this;
                    var url = "api/control/erppage/selectInList?name=" + this.value3;
                    Http.ajax({
                        url: url,
                        data: {},
                        method: "post",
                        isSync: true,
                        isJson: true,
                        lock: false,
                        success: function (ret) {
                            console.log(ret, "公司数据");
                            self.industry = [];
                            if (ret.code === 200) {
                                main.industry = ret.data;
                                if (main.industry.length == 0) {
                                    _g.toast("未找到所属行业");
                                    self.industryPicker = false;
                                } else {
                                    self.industryPicker = true;
                                }
                            }
                        },
                    });
                }
            },
            //打开地图legwork-lookfor
            openMap(id) {
                _g.openWin({
                    header: {title: '选择服务地址'},
                    name: "bMap-index",
                    url: "../mySet/index_map_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {}
                })
            },
        }
    });


    (function () {

    })();
    module.exports = {};
});

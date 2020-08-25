define(function (require, exports, module) {
    var Http = require('U/http');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        components: {vant},
        template: _g.getTemplate('commercial/index_companyReg_view'),
        data: {
            fileList: [],
            chooseList: [
                {
                    title: '遵守拍账王服务流程',
                    isChecked: false
                },
                {
                    title: '服务协议',
                    isChecked: false
                }
            ],
            province: {},
            city: {},
            country: {},
            imageList: [],
            showProvince: false,
            provinceList: [],
            cityList: [],
            countryList: [],
            provinceShow: false,
            cityShow: false,
            countryShow: false,
            tagList: [],
            requestTag: [],
            tagActive: -1,
            price: 0,
            priceList:[],
            serviceContent: '',
            prepareData: '',
            lon: 113.48,
            lat: 23.11,
            id: ''
        },
        filters: {
            textShow(obj) {
                if (obj.beatRegionName) {
                    return obj.beatRegionName
                }else{
                    return  '请选择'
                }
            }
        },
        methods: {
            // 获取当前定位
            getLocation() {
                let bMap = api.require('bMap')
                bMap.getLocation({
                    accuracy: '100m',
                    autoStop: true,
                    filter: 1
                }, (ret, err) => {
                    if (!ret.status) {
                        _g.toast("请检查手机位置权限是否开启~")
                        main.address = '定位失败'
                    } else if (ret.status) {
                        this.lon = ret.lon
                        this.lat = ret.lat
                    } else {
                        _g.toast("位置获取失败！")
                    }
                })
            },
            onCountryConfirm(value) {
                this.country = value
                this.countryShow = false
                this.price = 0
                this.tagList.forEach(item => {
                    item.isChecked = false
                })
            },
            loadCountryData (){
                if (this.city.beatRegionId){
                    Http.ajax({
                        data: {
                            "data": {
                                "userId": this.city.beatRegionId
                            }
                        },
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: "api/control/beatRegion/selectArea",
                        success: result => {
                            this.countryList = result.data.map(item => {
                                return {
                                    ...item,
                                    text: item.beatRegionName
                                }
                            })
                            this.countryShow = true
                        }
                    })
                }else{
                    _g.toast('请先选择市')
                }
            },
            onCityConfirm(value) {
                this.city = value
                this.cityShow = false
            },
            loadCityData() {
                if (this.province.beatRegionId) {
                    Http.ajax({
                        data: {
                            "data": {
                                "userId": this.province.beatRegionId
                            }
                        },
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: "api/control/beatRegion/selectCity",
                        success: result => {
                            this.cityList = result.data.map(item => {
                                return {
                                    ...item,
                                    text: item.beatRegionName
                                }
                            })
                            this.cityShow = true
                            this.country = {}
                        }
                    })
                }else {
                    _g.toast('请先选择省份')
                }
            },
            onProvinceConfirm(value) {
                this.province = value
                this.provinceShow = false
            },
            afterRead(file) {
                let form = new FormData()
                form.append('file',file.file)
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
                    }
                })
            },
            beforeDelete(params,obj) {
                this.imageList.splice(obj.index,1)
                return true
            },
            loadProvinceData () {
                Http.ajax({
                    data: {},
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: "api/control/beatRegion/selectProvince",
                    success: result => {
                        this.provinceList = result.data.map(item => {
                            return {
                                ...item,
                                text: item.beatRegionName
                            }
                        })
                        this.provinceShow = true
                        this.city = {}
                        this.country = {}
                    }
                })
            },
            openProtocol(index){
                if (index === 1){
                    _g.openWin({
                        header:{title:'服务协议'},
                        name:"companyReg-protocol",
                        url:"../commercial/companyReg_protocol_frame.html",
                        bounces:false,
                        slidBackEnabled:false,
                        bgColor:'#fff',
                        pageParam:{} //携参
                    })
                }
            },
            choose(index) {
                this.chooseList[index].isChecked = !this.chooseList[index].isChecked
            },
            beforeRead(file) {
                if (file.type !== 'image/jpeg') {
                    _g.toast('请上传 jpg 格式图片');
                    return false;
                }
                return true;
            },
            loadTagList() {
                Http.ajax({
                    data: {},
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: "api/control/beatLabel/selectBeatLabelList",
                    success: result => {
                        this.tagList = result.data.list.map((item,index) => {
                            return {
                                ...item,
                                //tagIndex: index,
                                isChecked: false
                            }
                        })
                    }
                })
            },
            changeTagStyle(item,index) {
                if (!this.country.beatRegionId){
                    _g.toast('请先选择区域')
                    return
                }
                item.isChecked = !item.isChecked
                let typeIds = []
                this.tagList.forEach(item => {
                    if (item.isChecked) {
                        typeIds.push(item.id)
                    }
                })
                if (typeIds.length !== 0){
                    Http.ajax({
                        data: {
                            "data": {
                                "areaId": this.country.beatRegionId,
                                "typeId": typeIds
                            },
                        },
                        isJson: true,
                        method: "post",
                        isSync: true,
                        lock: true,
                        url: "api/control/beatServicePrice/selectPriceByAreaId",
                        success: result => {
                            this.price = result.data
                        }
                    })
                }else {
                    this.price = 0
                }
            },
            addService() {
                if (this.imageList.length === 0) {
                    _g.toast('请上传图片')
                    return
                }
                if (!this.province.beatRegionName) {
                    _g.toast('请选择省')
                    return
                }
                if (!this.city.beatRegionName) {
                    _g.toast('请选择市')
                    return
                }
                if (!this.country.beatRegionName) {
                    _g.toast('请选择区')
                    return
                }
                if (this.tagList.length === 0) {
                    _g.toast('请选择服务类型')
                    return
                }
                if (this.serviceContent === '') {
                    _g.toast('请输入服务内容')
                    return
                }
                if (!this.chooseList[0].isChecked){
                    _g.toast('请遵守拍账王服务流程')
                    return
                }
                if (!this.chooseList[1].isChecked){
                    _g.toast('请遵守服务协议')
                    return
                }
                let imgUrl = ''
                this.imageList.forEach(item => {
                    imgUrl += item + ';'
                })
                let serverTypeIds = ''
                this.tagList.forEach(item => {
                    if (item.isChecked) {
                        serverTypeIds += item.id + ';'
                    }
                })

                let postData = {
                        "city": this.city.beatRegionName,
                        //JSON.parse(_g.getLS('companyList'))[0].id  4028818b7356d292017356dc060f0011
                        "companyId": _g.getLS('companyId'),
                        "content": this.serviceContent,
                        "createTime": new Date().getTime(),
                        "demandSum": 0,
                        "district":this.country.beatRegionName,
                        //"id": "string",
                        "imageUrl": imgUrl,
                        "latitude": this.lat,
                        "longitude": this.lon,
                        "money": this.price,
                        "prepareData": this.prepareData,
                        "province": this.province.beatRegionName,
                        "labelId": serverTypeIds,
                        "serverTypeId": "001",
                        //_g.getLS('userId')  4028818b7356d292017356dc06080010
                        "userId": _g.getLS('userId')
                }
                //_g.alert(postData)
                let url = 'api/control/beatServer/createBeatServer'
                Http.ajax({
                    data: {
                        "data": postData
                    },
                    isJson: true,
                    method: "post",
                    isSync: true,
                    lock: true,
                    url: url,
                    success: result => {
                        if (result.code === 200) {
                            _g.toast('新增成功')
                            api.closeWin()
                        }
                    }
                })
            }
        },
        mounted() {
            this.getLocation()
            this.loadTagList()
        },
        watch: {

        }
    });


    var _page = {};
    
    (function () {
        
    })();
    module.exports = {};
});

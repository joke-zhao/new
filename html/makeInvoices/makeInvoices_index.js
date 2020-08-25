define(function (require, exports, module) {
    var Http = require('U/http');
    var swiper = require('L/swiper/swiper.min.js');
    var vant = require("L/vant/vant.min.js");
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('makeInvoices/makeInvoices_index_view'),
        data: {
            invoicingEntity: {
                companyName: "",
                documentNum: "",
                documentDate: "",
                currency: "人民币",
                money: "0.00",
                invoiceType: "普票",
                mediaType: "纸质发票",
                buyName: "",
                buyTaxNum: "",
                buyAddressPhone: "",
                buyBankNum: "",
                // sellName: "",
                sellTaxNum: "",
                sellAddressPhone: "",
                sellBankNum: "",
                goods: []
            },
            show: false,
            minDate: new Date(2010, 0, 1), // 日期范围
            showDate: false,
            dateVal: '', //日期时间戳
            OrgList: [],
            currencyList: [{ text: '人民币', value: "人民币" }, { text: '美金', value: "美金" }],
            invoiceTypeList: [{ text: '普票', value: "普票" }, { text: '专票', value: "专票" }],
            mediumTypeList: [{ text: '纸质发票', value: "纸质发票" }, { text: '其他发票', value: "其他发票" }],
            checkAll: true,
            goodsItem: {
                taxProductName: "",
                taxCode: "",
                productName: "",
                type: "",
                meas: "",
                size: "",
                unitPrice: "",
                money: "",
                taxRate: "",
                tax: "",
                summary: "",
            }
        },
        created: function () {
            this.getOrgList();
        },
        filters: {
            formatDate(date) {
                if (!date) {
                    return '请选择时间';
                } else {
                    var a = new Date(date).Format("yyyy-MM-dd")
                    return a
                }
            },
        },
        components: {
            vant,
        },
        methods: {
            getOrgList() {
                var self = this;
                var url = "/api/control/beatCompany/handleCompany";
                var options = {
                    data: {
                        userId: _g.getLS("userId"),
                        // userId: "2c9274f673b2fa3d0173b31238f30008",
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
                        // console.log(ret);
                        if (ret.code === 200) {
                            main.OrgList = [];
                            main.invoicingEntity.companyName = ret.data[0].name;
                            ret.data.forEach(function (ele) {
                                var item = {};
                                item.text = ele.name;
                                item.value = ele.name;
                                main.OrgList.push(item);
                            });
                        } else {
                            _g.toast(ret.message);
                        }
                    },
                });
            },
            // 选择单据日期
            onConfirm(date) {
                this.showDate = false;
                this.dateVal = date.getTime();
            },
            // 添加商品 确认
            confirmItem() {
                this.show = false;
                if (!this.goodsItem.vid) {
                    // 新增
                    var goodsItemTemp = this.goodsItem;
                    this.goodsItem = {};
                    goodsItemTemp.vid = new Date().getTime();
                    this.invoicingEntity.goods.push(goodsItemTemp);
                }
                this.sumMoney();
            },
            // 当用户第一次开票时跳转至第一次开票页面-否则弹出开票商品详情
            submitInvoices() {
                if (true) {
                    this.openFirst()
                }
            },
            // 打开第一次开票页面
            openFirst() {
                _g.openWin({
                    header: { title: '第一次开票' },
                    name: "index-first",
                    url: "../makeInvoices/index_first_frame.html",
                    bounces: false,
                    slidBackEnabled: false,
                    bgColor: '#fff',
                    pageParam: {} //携参
                })
            },
            // 添加商品
            addGooditem() {
                this.show = true;
                this.goodsItem = {};
            },
            // 添加商品 取消
            closePopup() {
                this.show = false;
            },
            // 修改商品
            modifyGooditem(index) {
                this.goodsItem = this.invoicingEntity.goods[index];
                this.show = true;
            },
            // 删除商品
            delGooditem(index) {
                this.invoicingEntity.goods.splice(index, 1);
                this.sumMoney();
            },
            // 计算金额
            sumMoney(){
                var money = "0.00";
                this.invoicingEntity.goods.forEach(function(item){
                    money = Number(item.money) + Number(money);
                });
                this.invoicingEntity.money = money;
            },
            submitInvoices(){
                var self = this;
                var url = "/api/control/beatInvoicing/createBeatInvoicing";
                this.invoicingEntity.documentDate = this.dateVal;
                this.invoicingEntity.userId = _g.getLS("userId");
                // this.invoicingEntity.userId = "2c9274f673b2fa3d0173b31238f30008";
                var options = {
                    data: this.invoicingEntity,
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
                        console.log(ret);
                        if (ret.code === 200) {
                            _g.toast(ret.message);
                        } else {
                            _g.toast(ret.message);
                        }
                    },
                });
            }

        }

    });

    var _page = {
        initSwiper: function () {
            var swiper = new Swiper('.swiper-container', {
                // direction: 'horizontal',
                // initialSlide: 0,
                // autoplay: 1000
                // autoplayStopOnLast: true
            });
        }
    };

    //_page.initSwiper();
    (function () {

    })();
    module.exports = {};
});

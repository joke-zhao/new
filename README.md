# fecode-apicloud

专门针对APICloud设计的轻量级前端开发框架, 适用于Vue技术栈

安装 node-12.10.0 
全局安装 gulp npm i gulp@4.0.2 -g

### 框架能力

* 支持Less
* 支持Vue 2.6
* 支持Hammer手势指令
* 支持浏览器自动刷新
* 支持跨平台能力
* 支持CMD模块定义
* 支持接口代理转发

### 环境安装

* `node v12.10.0` [安装](http://nodejs.cn/)
* 设置npm源 `npm config set registry https://registry.npm.taobao.org` 
* gulp@4.0.2全局安装 `npm i gulp@4.0.2 -g`
* 拉取项目仓库代码后, 执行 `npm i`
* 建议新建 `commonProject` (只需要建一次,以后每个项目修改`gulpfile.js` 中的 `baseDir`)
    - 由于要使用`Apicloud Studio`进行同步,所以 `node_modules` 不能放在项目的`widget`,否则会因为代码量过大无法同步
    - `baseDir` Windows需要传入相对路径, Mac本机的绝对路径
* 启动项目, 执行 `gulp`

### 项目结构

```
┌─css                          编译后的css文件夹, 开发时不要直接修改该文件夹
│  ├─base                        基础样式目录
│  ├─baseWin                     通用页面样式
│  ├─common                      公共样式
│  ├─base.css                    所有页面都引用的基础样式
│  ├─xxx                         业务模块目录, 所有业务模块采取二级结构, 保持层级一致
│  └─...
│
├─html                         项目开发页面目录, 以业务为模块, 模块内部平级, 文件名与模块名必须一致
│  ├─baseWin                     通用页面
│  │  ├─index.js                 
│  │  └─index.html               
│  ├─common                      公共页面
│  │
│  ├─lead                      APP启动
│  │  ├─index.css                  应用入口 - 首页 - 样式代码
│  │  ├─index.html                 应用入口 - 首页 - 视图模板
│  │  └─index.js                   应用入口 - 首页 - 逻辑代码
│  └─aaa                         业务模块名称aaa
│     ├─bbb.css                    子业务bbb, 样式代码
│     ├─bbb.html                   子业务bbb, 视图模板
│     ├─bbb.js                     子业务bbb, 逻辑代码
│     ├─ccc-index.css              子业务ccc, index功能, 样式代码
│     ├─ccc-index.html             子业务ccc, index功能, 视图模板
│     └─ccc-index.js               子业务ccc, index功能, 逻辑代码
│
├─image                        项目开发图片目录, 采取二级结构, 保持跟业务模块层级一致
│  └─...                         
│
├─less                         项目开发less文件夹, 开发时样式修改应该通过这个目录进行
│  ├─base                        基础样式目录
│  ├─baseWin                     通用页面样式
│  ├─common                      公共样式
│  ├─base.css                    所有页面都引用的基础样式
│  ├─xxx                         业务模块目录, 所有业务模块采取二级结构, 保持层级一致
│  └─...
│
├─script                       项目js脚本目录, 存放工具类, 依赖包, 入口文件等
│  ├─app.js                      APP入口js文件
│  ├─base.js                     所有页面都引用的基础脚本
│  ├─global.js                   项目的全局配置
│  └─...
│
├─config.xml                   APICloud工程配置
├─gulpfile.js                  gulp工程入口
├─index.html                   应用入口页面
└─README.md                    项目开发说明文档  
```

### 项目开发

#### 1.项目初始化

从代码仓库中, 拉取最新代码

#### 2.配置项目参数

项目需要配置的参数都在 `global.js` 文件中

```
window.APPMODE = 'pub'; // dev:开发模式, pub:发布模式
window.VERSION = '0.0.1'; // 代码版本号, 每次发布之前, 请更新, 小版本号自增+1
window.MOCKJS = false; // 是否打开mockjs, 正式版发布, 或者测试接口数据需要关闭
window.CONFIG = {}; // 全局配置
CONFIG.DEFAULT_AVATAR = ''; // 默认头像
CONFIG.DEFAULT_PHOTO = ''; // 默认图片

APPMODE == 'pub' && (function() {
    CONFIG.HOST = ''; //请求域名
})();
```

#### 3.新建页面

* 每个页面由一个win与n个frame组成
* 新建页面的时候按照 `业务模块` , `子模块`  划分,  统一存放在 `html` 目录下
* 每个页面由 `frame` `view` `js` `css` 组成, 新建页面文件名应该保持一致

```
例如账号模块
less/account/login.less
html/account/login_frame.html
html/account/login_view.html
html/account/login.js
例如文章模块
less/article/list.less
html/article/list_frame.html
html/article/list_view.html
html/article/list.js
less/article/detail.less
html/article/detail_frame.html
html/article/detail_view.html
html/article/detail.js
```

* 页面必须执行以下代码 

```
define(function (require, exports, module) {
    var Http = require('U/http');
    var main = new Vue({
        el: '#main',
        template: _g.getTemplate('demo/index_view'),
        data: {},
        filters: {},
        methods: {}
    });
    var _page = {};
    var sendApi = {};
    (function () {})();
    module.exports = {};
});

```

#### 4.页面样式

* 全局样式由 `base.css` 提供
* 每个页面可以设置自己单独的页面样式, 要做到样式命名不会污染, 使用 `BEM` 命名规范
* 每个页面组件以模块名字作为页面 `dom` 元素最外层 `div` 的 `id`

#### 5.请求数据

* 提供方法 `http.ajax` 来请求数据
* 方法接受一个 `options` 类型的入参, 具体配置跟 `$.ajax` 的配置一致
* 方法会自动处理请求的数据, 对 `data` 字段进行序列化操作
* 方法额外提供一个字段 `lock` 用于设置当前情况下只能执行一个请求, 常用于入库操作, 避免重复插入

```
Http.ajax({
	data: {},
	url: '',
	isSync: true,
	lock: true,
	success: function(ret) {},
	error: function(err) {}
});
```

#### 6.页面跳转

* 提供方法 `_g.openWin(param, normal)` 来进行页面之间的跳转
* param是页面的配置
* normal是选传参数, 打开自定义头部的页面需要传入, 传入后, 打开的页面即时win

```
1.只跳转页面
_g.openWin({
    header: {
        title: '',
        leftIcon: '',
        rightIcon: '',
        leftText: ''
    },
    name: 'msg-dialogue',
    url: '../msg/dialogue_frame.html',
    pageParam: {
        //传递参数
        type: 1
    }
});
2.另一个页面接收
var type = api.pageParam.type;
3.左右按钮的点击事件 在当前页面填写
window.leftBtnTap = function() {
    //TODO
};
window.rightBtnTap = function() {
    //TODO
};
```

#### 7.通用头部说明
* 首先说明一下页面的组成
    - 一个页面由一个win与n个frame组成
* 通过`_g.openWin(param);`打开的页面
    - 首先会打开 `baseWin/index` ,这个页面属于每个通用页面的 `win` , `api.winName` 为 `param.name + '-win'`
    - `param.url`会在baseWin通过打开`frame`的形式打开,`api.frameName`为`param.name + '-frame'`
    - 如果通用头部不符合预期的效果, 但是样式没有太大的变化, 可以使用`customerHeader` , 详细请查看 `baseWin/custom_header_view`
* 通过`_g.openWin(param, normal);`打开的页面
    - 直接打开`param.url`, 该页面是 `win`, 不会有通用头部

#### 8.数据绑定与双向绑定

* `vue` [数据绑定文档](https://cn.vuejs.org/v2/guide/syntax.html)

```
// 逻辑代码
var main = new Vue({
    el: '#main',
    data: {},
});
// 视图模板
<div class="ui-main"></div>
```

* 通过 `input`  `v-model` 实现数据双向绑定

```
// 逻辑代码
var main = new Vue({
    el: '#main',
    data: {
        title: ''
    }
});
// 视图模板
<input v-model="title">
```

#### 9.事件绑定

* `vue` [事件绑定文档](https://cn.vuejs.org/v2/guide/events.html)
* 通过 `methods` 实现数据绑定

```
// 逻辑代码
var main = new Vue({
    methods: {
        onClick: function (xxx) {
            
        }
    }
});
// 视图模板
<div v-hammer:tap="onClick"></div>
<div v-hammer:tap="()=>onClick(xxx)"></div>
```

#### 10.页面通讯

* 通过 `_g.execScript`进行页面通讯

```
_g.execScript({
    winName: 'winName', // 必填 填目标页面
    frameName: 'frameName', // 可选 填目标页面 需要把值传入的页面
    fnName: 'fnName', // 必填, 要执行的window.xxx, 只需要传入xxx
    data: {} // 可选, 规范必须传对象格式
});
//另一个页面
window.fnName = function (data) {
    //TODO 
};
```

### 项目配置(Author:Yancey) 2020-06-28添加
* 1.沉浸式效果
```
    在main -index.js页面打开这段注释为非沉浸式   注释为沉浸式
    //配置Main首页的Frame窗口是否为沉浸式效果
    $('#header').css('padding-top', _g.getLS('StatusBarHeight') + 'px');
    在main -index.css 里 注释 #header 里的height为打开沉浸式  取消注释为非沉浸式
```
* 2.修改二级页面头部样式
```
    在baseWin  -index.css  --类名为ui-header  color为头部标题颜色   background-color为头部标题背景颜色
```
* 3.注意 在手机端 提交方式在http.js  Web端在xiu.js    手机端isfile为文件上传  isJson为json数据提交  默认为表单提交

* 4.项目中如何正确的引入一些外部组件:
```
    (4-1).例如Echarts
        需下载echarts.min.js   然后在frame页面引入<script src="../../script/lib/echarts/echarts.min.js"></script>
        接下来就在mounted()里init你的echarts图标就好啦~
    (4-2).例如Vant(UI组件库)
        需下载vant的css 然后在frame页面引入<link rel="stylesheet" href="../../script/lib/vant/index.css" />
        在页面的index.js new vue实例化之前定义var vant = require('L/vant/vant.min.js');
        然后在vue实例化中使用components中动态引入组件
        components: {
            vant,
        },
```
### 项目依赖
* gulp `4.0.2`
* vue `2.6.10`
* Zepto
* less `4.0.1`



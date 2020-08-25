define(function (require, exports, module) {

    // 让列表带有Toolbar
    // 依赖hammer.js
    // dom结构应该满足以下要求
    // <ul class="ui-list">
    //     <li class="ui-listItem">
    //         <div class="ui-listItemBox"></div>
    //     </li>
    // </ul>
    // ui-listItem 必须是 position: relative;
    // ui-listItemBox 必须是 position: absolute;
    // 模块会自动插入 ui-listToolbar 结构
    // 用法 DEMO
    // var ListToolbar = require('U/listToolbar');
    // ListToolbar.init({
    //     listClassName: '.ui-list',
    //     toolbarButtons: [{
    //         title: '删除',
    //         width: 100,
    //         fontSize: 24,
    //         fontColor: '#ffffff',
    //         bgColor: '#ff5860',
    //         action: 'delete'
    //     }, {
    //         title: '添加',
    //         width: 100,
    //         fontSize: 24,
    //         fontColor: '#ffffff',
    //         bgColor: '#123123',
    //         action: 'add'
    //     }],
    //     onToolbarBtnTap: function (ret) {
    //         if (ret.btnAction === 'delete') {
    //             ListToolbar.delete(ret.itemIndex)
    //         }
    //     },
    //     onItemTap: function (ret) {
    //         console.log(ret);
    //     },
    //     onDeleteDone: function (ret) {
    //         self.list.splice(ret.itemIndex, 1);
    //         Vue.nextTick(function () {
    //             ListToolbar.refresh();
    //         });
    //     }
    // });
    // 注意事项: 使用删除的时候需要放在 Vue.nextTick 中执行 refresh

    function ListToolbar() {
        this.hammer = null;
        this.listClassName = null;
        this.$list = null;
        this.$listItem = null;
        this.$listItemBox = null;
        this.defaultButton = {
            title: '删除',
            fontSize: 24,
            width: 80,
            fontColor: '#ffffff',
            bgColor: '#ff5860',
            action: 'delete'
        };
        this.toolbarButtons = [];
        this.listToolbarClassName = 'ui-listToolbar';
        this.listToolbarBtnClassName = 'ui-listToolbarBtn';
        this.onItemTap = function (ret) {
            // itemIndex, ev
        };
        this.onToolbarBtnTap = function (ret) {
            // itemIndex, btnIndex, btnAction, ev
        };
        this.onDeleteDone = function (ret) {
            // itemIndex
        };
    }

    ListToolbar.prototype = {
        init: function (opts) {
            var self = this;
            opts = opts || {};

            if (!opts.listClassName) throw '初始化的列表类名不能为空';

            // 初始化配置
            self.listClassName = opts.listClassName;
            self.toolbarButtons = opts.toolbarButtons || [];
            if (opts.onItemTap) self.onItemTap = opts.onItemTap;
            if (opts.onToolbarBtnTap) self.onToolbarBtnTap = opts.onToolbarBtnTap;
            if (opts.onDeleteDone) self.onDeleteDone = opts.onDeleteDone;

            self.$list = $(self.listClassName);
            self.$listItem = self.$list.children();
            self.$listItemBox = self.$listItem.children();

            self.$listItem.css('-webkit-transition', 'height 0.2s');
            self.$listItemBox.css('-webkit-transition', 'transform 0.2s');

            var listItemClassName = '.' + self.$listItem[0].classList[0];
            var listItemBoxClassName = '.' + self.$listItemBox[0].classList[0];

            // 初始化 hammer 交互
            var $hammerItem = null;
            var toolbarWidth = 0;
            var hammerAllow = true;
            var hammerEnd = false;

            self.hammer = new Hammer(self.$list[0], {});
            self.hammer.on('tap', function (ev) {
                $hammerItem = $(ev.target).closest(listItemClassName);
                if (ev.target.classList[0] === self.listToolbarBtnClassName) {
                    self.onToolbarBtnTap({
                        itemIndex: $hammerItem.index(),
                        btnIndex: $(ev.target).index(),
                        btnAction: $(ev.target).data('action'),
                        ev: ev
                    });
                } else {
                    self.onItemTap({
                        itemIndex: $hammerItem.index(),
                        ev: ev
                    });
                }
            });
            self.hammer.on('panstart', function (ev) {
                $hammerItem = $(ev.target).closest(listItemClassName);
                toolbarWidth = $hammerItem.find('.' + self.listToolbarClassName).width();
                hammerEnd = false;
            });
            self.hammer.on('panmove', function (ev) {
                if (!hammerAllow) return;
                if ($hammerItem.hasClass('is-active')) {
                    if (ev.deltaX >= 0) {
                        $hammerItem.find(listItemBoxClassName).css({
                            'transition-duration': '0.2s',
                            '-webkit-transform': 'translate3d(0,0,0)'
                        });
                        hammerAllow = false;
                        setTimeout(function () {
                            $hammerItem.removeClass('is-active');
                            hammerAllow = true;
                            hammerEnd = true;
                        }, 200);
                    }
                } else {
                    if (ev.deltaX >= 20) {
                        ev.deltaX = 20;
                    } else {
                        if (ev.deltaX < -toolbarWidth - 20) {
                            ev.deltaX = -toolbarWidth - 20;
                        }
                    }
                    $hammerItem.find(listItemBoxClassName).css({
                        '-webkit-transform': 'translate3d(' + ev.deltaX + 'px,0,0)',
                        'transition-duration': '0s'
                    });
                    self.$list.find('.is-active').find(listItemBoxClassName).css({
                        'transition-duration': '0.2s',
                        '-webkit-transform': 'translate3d(0,0,0)'
                    });
                    self.$list.find('.is-active').removeClass('is-active');
                }
            });
            self.hammer.on('panend pancancel panup', function (ev) {
                if (hammerEnd) {
                    hammerAllow = true;
                    // if (['pancancel', 'panup'].indexOf(ev.type) > -1) {
                    //     hammerEnd = false;
                    // }
                    return;
                }
                if (!hammerAllow) return;
                if (ev.deltaX >= 0) {
                    $hammerItem.find(listItemBoxClassName).css({
                        'transition-duration': '0.2s',
                        '-webkit-transform': 'translate3d(0,0,0)'
                    });
                    hammerAllow = false;
                    setTimeout(function () {
                        $hammerItem.removeClass('is-active');
                        hammerAllow = true;
                    }, 200);

                } else if (ev.deltaX > -toolbarWidth * 0.3 && ev.deltaX < 0) {
                    $hammerItem.find(listItemBoxClassName).css({
                        'transition-duration': '0.2s',
                        '-webkit-transform': 'translate3d(0,0,0)'
                    });
                    hammerAllow = false;
                    setTimeout(function () {
                        $hammerItem.removeClass('is-active');
                        hammerAllow = true;
                    }, 200);
                } else if (ev.deltaX <= -toolbarWidth * 0.3) {
                    $hammerItem.find(listItemBoxClassName).css({
                        'transition-duration': '0.2s',
                        '-webkit-transform': 'translate3d(' + (-toolbarWidth) + 'px,0,0)'
                    });
                    hammerAllow = false;
                    $hammerItem.addClass('is-active');
                    setTimeout(function () {
                        hammerAllow = true;
                    }, 200);
                }
            });

            // 刷新 DOM 结构
            self.refresh();
        },
        refresh: function () {
            var self = this;

            self.$list = $(self.listClassName);
            self.$listItem = self.$list.children();
            self.$listItemBox = self.$listItem.children();

            self.$listItem.css('-webkit-transition', 'height 0.2s');
            self.$listItemBox.css('-webkit-transition', 'transform 0.2s');

            var listItemHeight = self.$listItem.eq(0).height();

            _.each(self.$listItem, function (item) {
                var $item = $(item);
                if ($item.find('.' + self.listToolbarClassName).length < 1) {
                    var $listToolbar = $('<div class="' + self.listToolbarClassName + '"></div>');
                    $listToolbar.css({
                        'display': 'block',
                        'position': 'absolute',
                        'right': 0,
                        'top': 0,
                        'height': listItemHeight + 'px',
                        'font-size': 0
                    });
                    _.each(self.toolbarButtons, function (button) {
                        var $toolbarButton = $('<span class="' + self.listToolbarBtnClassName + '"></span>');
                        $toolbarButton.text(button.title || self.defaultButton.title);
                        $toolbarButton.css({
                            'display': 'inline-block',
                            'width': (button.width || self.defaultButton.width) / 100 + 'rem',
                            'height': listItemHeight + 'px',
                            'line-height': listItemHeight + 'px',
                            'text-align': 'center',
                            'font-size': (button.fontSize || self.defaultButton.fontSize) / 100 + 'rem',
                            'color': button.fontColor || self.defaultButton.fontColor,
                            'background-color': button.bgColor || self.defaultButton.bgColor
                        });
                        $toolbarButton.data('action', button.action || self.defaultButton.action);
                        $listToolbar.append($toolbarButton);
                    });
                    $item.prepend($listToolbar);
                }
            });
        },
        delete: function (itemIndex) {
            var self = this;
            var $item = self.$listItem.eq(itemIndex);
            $item.find('.' + self.listToolbarClassName).hide();
            $item.css('-webkit-transition', 'height 0.2s');
            setTimeout(function () {
                $item.css('height', '0px');
            }, 0);

            setTimeout(function () {
                self.onDeleteDone({
                    itemIndex: itemIndex
                });
            }, 200);
        }
    };

    ListToolbar.prototype.constructor = ListToolbar;

    module.exports = new ListToolbar();

});

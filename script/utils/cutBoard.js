define(function(require, exports, module) {

    // 依赖underscore
    // 使用方法 CutBoard.fetchBoardCount(boxs, board);
    // boxs 必穿参数, 是传入的待切割的数组, 如 ['1600x800', '800x800', '160x400']
    // board 可以为空, 是整板大小, 默认为 [1220, 2440]

    function CutBoard() {
        this.board = [1220, 2440];
        this.leaveBox = [];
        this.result = [];
        this.canCut = false;
        this.needBoardCount = 1;
    }

    CutBoard.prototype = {
        fetchBoardCount: function(boxs, board) {
            var self = this;
            if (!_.isArray(boxs)) throw 'boxs must be array';
            if (board && !_.isArray(board)) throw 'board must be array';
            // 重置计算参数
            self.reset();
            // 初始化余料板
            self.leaveBox.push(board ? board : self.board);

            // 把切割的规格按照小边在宽, 大边在高的方式统一
            boxs = _.map(boxs, function(_box) {
                var _box = self.getSize(_box);
                if (_box[0] < _box[1]) return _box[0] + 'x' + _box[1];
                else return _box[1] + 'x' + _box[0];
            });
            // 从大到小排序要切割的规格
            var _boxs = _.sortBy(boxs, function(_box) {
                var _box = self.getSize(_box);
                return -_box[0] * _box[1]
            });
            // 从最大的规格开始循环切割
            _.each(_boxs, function(_box) {
                var _box = self.getSize(_box);
                // 对剩下的板从小到大排列
                self.leaveBox = _.sortBy(self.leaveBox, function(_leaveBox) {
                    return _leaveBox[0] * _leaveBox[1]
                });
                // 从剩下的板中取出最小的板来判断是否可以切
                // 如果可以切, 停止往下循环, 不能切就继续查找更大的板材来切
                // 如果遍历完成都没有可以切的余板, 那就新增一块大板
                self.canCut = false;
                self.tryCut(_box);
                if (!self.canCut) {
                    self.needBoardCount++;
                    self.leaveBox.push(self.board);
                    self.tryCut(_box);
                }
            });

            console.log(_g.j2s(self.leaveBox), 'leaveBox', _g.j2s(self.result), 'result', self.needBoardCount);
            return self.needBoardCount;
        },
        // 尝试切割
        tryCut: function(_box) {
            var self = this;
            // 判断余料板数组能否切割这个规格, 如果可以切割中断循环
            _.some(self.leaveBox, function(_leaveBox, _index) {
                if (_box[0] <= _leaveBox[0] && _box[1] <= _leaveBox[1]) {
                    // 可以切
                    self.cutBoard(_box, _leaveBox, _index);
                    return self.canCut = true;
                }
            });
        },
        // 实际切割
        cutBoard: function(_box, _board, _index) {
            var self = this;
            if (_box[1] > _board[0]) {
                // 如果要切割的高比板的宽度要大, 那么只能从板的高度边来切
                var leaveBox_1 = [_board[0] - _box[0], _box[1]];
                var leaveBox_2 = [_board[0], _board[1] - _box[1]];
            } else {
                // 其他情况, 以余料少的另外一边作为高度边切的依据
                var leave_w = _board[0] % _box[0];
                var leave_h = _board[0] % _box[1];
                if (leave_w < leave_h) {
                    var leaveBox_1 = [_board[0] - _box[0], _box[1]];
                    var leaveBox_2 = [_board[0], _board[1] - _box[1]];
                } else {
                    var leaveBox_1 = [_board[0] - _box[1], _box[0]];
                    var leaveBox_2 = [_board[0], _board[1] - _box[0]];
                }
            }
            // 按照小边在宽, 大边在高的方式统一
            leaveBox_1 = _.sortBy(leaveBox_1);
            leaveBox_2 = _.sortBy(leaveBox_2);
            // 去除空板的情况
            if (leaveBox_1[0] * leaveBox_1[1] == 0) {
                self.leaveBox.splice(_index, 1, leaveBox_2);
            } else if (leaveBox_2[0] * leaveBox_2[1] == 0) {
                self.leaveBox.splice(_index, 1, leaveBox_1);
            } else {
                self.leaveBox.splice(_index, 1, leaveBox_1, leaveBox_2);
            }
            // 把每次切割的结果记录下来
            self.result.push({
                box: _box,
                board: _board,
                leaveBox_1: leaveBox_1,
                leaveBox_2: leaveBox_2
            });
        },
        getSize: function(_box) {
            var _box = _box.split('x');
            var w = Number(_box[0]);
            var h = Number(_box[1]);
            return [w, h];
        },
        reset: function() {
            this.leaveBox = [];
            this.result = [];
            this.canCut = false;
            this.needBoardCount = 1;
        },
        test: function() {
            var boxs = [];
            var test_1 = ['1600x800', '800x800', '160x400'];
            var test_2 = ['2000x800', '1200x400', '160x410'];
            var test_3 = ['2000x1050', '400x800', '100x1000', '100x1000'];
            var test_4 = ['1600x450', '1600x450', '1200x450'];
            var test_5 = ['1750x850', '1200x600'];
            var test_6 = ['1800x900', '300x400', '300x400', '300x400', '300x400', '600x600', '600x600'];

            boxs = test_1;
            this.fetchBoardCount(boxs);

            boxs = test_2;
            this.fetchBoardCount(boxs);

            boxs = test_3;
            this.fetchBoardCount(boxs);

            boxs = test_4;
            this.fetchBoardCount(boxs);

            boxs = test_5;
            this.fetchBoardCount(boxs);

            boxs = test_6;
            this.fetchBoardCount(boxs);

            boxs = test_2.concat(test_3);
            this.fetchBoardCount(boxs);

            boxs = test_2.concat(test_6).concat(test_4).concat(test_5);
            this.fetchBoardCount(boxs);

            var test_7 = ['1350x1220', '1350x1220', '1350x1220', '1350x1220', '1350x512', '1350x512'];
            boxs = test_7;
            this.fetchBoardCount(boxs);

            var test_8 = ['2440x1220', '2440x1220', '512x1220', '130x1500', '130x1500', '130x1500', '130x1500'];
            boxs = test_8;
            this.fetchBoardCount(boxs);
        }
    };

    CutBoard.prototype.constructor = CutBoard;

    module.exports = new CutBoard();

});

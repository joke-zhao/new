const gulp = require('gulp');
const less = require('gulp-less');
const cached = require('gulp-cached');
const browserSync = require('browser-sync');
const {createProxyMiddleware} = require('http-proxy-middleware');

const baseDir = '.';
console.log(baseDir);
// 创建一个用于同步刷新的浏览器服务, 端口3388
const bs1 = browserSync.create('dev:3388');
// 创建一个不会主动刷新的浏览器服务, 端口3399
const bs2 = browserSync.create('dev:3399');
// 设置接口代理转发
const browserProxyList = [
    createProxyMiddleware('/app', {
        target: 'http://crm.beckysofficial.com',
        changeOrigin: true
    }),
    createProxyMiddleware('/admin', {
        target: 'http://crm.beckysofficial.com',
        changeOrigin: true
    })
];

const devTask = {
    browser: (cb) => {
        bs1.init({
            ui: false,
            server: {
                baseDir: baseDir,
                directory: true,
                middleware: browserProxyList
            },
            files: [
                baseDir + '/html/**',
                baseDir + '/image/**',
                baseDir + '/script/**',
                baseDir + '/index.html',
            ],
            notify: false,
            ghostMode: false,
            port: 3388,
            open: false
        }, function (err, bs) {

        });

        bs2.init({
            ui: false,
            server: {
                baseDir: baseDir,
                directory: true,
                middleware: browserProxyList
            },
            notify: false,
            ghostMode: false,
            port: 3399,
            open: false
        });

        cb();
    },
    less: () => {
        return gulp.src(baseDir + '/less/**/*.less')
            .pipe(cached('less'))
            .pipe(less())
            .pipe(gulp.dest(baseDir + '/css'))
            .pipe(bs1.reload({stream: true}));
    },
    watch: () => {
        gulp.watch(baseDir + '/less/**/*.less', gulp.parallel(devTask.less));
    }
};

exports.default = gulp.series(devTask.browser, devTask.watch);
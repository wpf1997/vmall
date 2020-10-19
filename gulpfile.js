var {src , dest , series , parllel , watch } = require('gulp');
var clean = require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');

function cleanTask(){
    return src('/dist',{allowEmpty : true})
        .pipe( clean() )
}

function fileIncludeTask(){
    return src('./src/view/*.html')
        .pipe(fileInclude({
            prefix : '@',
            basepath : './src/view/templates'
        }))
        .pipe(dest('./dist/view'));
}

function webserverTask(){
    return src('./dist/view')
        .pipe( webserver({
            host : 'localhost',
            port : 4000,
            open : './index.html',
            livereload : true
        }));
}

function watchTask(){   //监听文件变化，同步到dist文件下
    watch('./src/view/**' , fileIncludeTask);
    watch('./src/css/**' , sassTask);
    watch('./src/static/**' , staticTask);
    watch('./src/lib/**' , libTask);
    watch('./src/api/**' , apiTask);
    watch('./src/js/**' , jsTask);
}
module.exports = {
    //开发环境下的命令
    dev : series( cleanTask , parallel(fileIncludeTask , sassTask , staticTask , libTask , apiTask , jsTask) , parallel(webserverTask , watchTask) ),
    //生产环境下的命令
    build : series( cleanTask )
} 
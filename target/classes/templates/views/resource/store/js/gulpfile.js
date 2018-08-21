var config = require('/home/vagrant/project/site_shop/public/store/source/js/build.js');
var gulp = require('gulp'),
  uglify = require('gulp-uglify'),//压缩
  jshint = require('gulp-jshint'),//代码质量检测
  clean = require('gulp-clean'),//清理
  concat = require('gulp-concat'),//连接合并文件
  rjs = require('gulp-requirejs'),//require.js
  shell = require('gulp-shell');

//清理先前的
gulp.task('clean', function () {
  console.log('appdir:'+config.appdir);
  gulp.src([config.appdir+'/dest/js',config.appdir+'/dest/build'],{read:false})
    .pipe(clean());
  return;
});


//优化打包
gulp.task('req', function() {

  for(var i= 0,len = config.module.length;i<len;i++)
  {
    rjs({
      baseUrl:config.baseUrl,
      name:config.module[i].name,
      paths:config.module[i].paths,
      out:config.module[i].name+'.js'
    })
      .pipe(gulp.dest(config.appdir+'/dest/build/'));
  }
  return;
});

//发布
gulp.task('build',function(){

  console.log('准备中...');

  for(var i= 0,len = config.module.length;i<len;i++)
  {
    //压缩
    gulp.src(config.appdir+'/dest/build/'+config.module[i].name+'.js')
      .pipe(uglify())
      .pipe(concat(config.module[i].name+'.js'))
      .pipe(gulp.dest(config.appdir+'/dest/js/'));

  }

  //要记得擦屁股
  gulp.src(config.appdir+'/dest/build/',{read:false})
    .pipe(clean());

  return;
});

//copy
gulp.task('copy', function () {

  //执行shell
  gulp.src(config.appdir, {read: false})
    .pipe(shell([
      'cp '+config.baseUrl+'require.min.js dest/js/'
    ]));

});

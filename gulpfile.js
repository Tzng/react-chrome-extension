var gulp = require('gulp');
var del = require('del');

// 拷贝
gulp.task('copy',function(){
  return gulp.src('./chrome/assets/content/*')
    .pipe(gulp.dest('./dev/content/'));
});

// watch监视的使用
gulp.task('dist',function(){
  return gulp.watch('chrome/content/content-script.js',['copy']);
});

//监听任务
gulp.task("watch-all",async ()=>{
  //复制文件
  gulp.watch("./chrome/assets/content/*",async ()=>{ //监听项目开发路径下所有的内容（包括子文件夹，不管有多少级）
    gulp.src("./chrome/assets/content/*") //项目开发路径下所有的内容
      .pipe(gulp.dest("./dev/content/")); //项目发布路径（服务器文件夹）
  });
});

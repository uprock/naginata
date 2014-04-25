var gulp = require('gulp');
gulp.task('build-templates-jadeRuntime', function (cb) {
    var jadeCompiler = require('./node_modules/clientjade/lib/compile');
    jadeCompiler({
        files: [require('path').resolve('./views')]
    }, function (err, data) {
        if (err) throw Error(err);
        var File = require('vinyl')
        var file = new File({
            cwd: __dirname,
            base: __dirname,
            path: __dirname + '/jadeTemplates.js',
            contents: new Buffer(data)
        });
        file.pipe(require('fs').createWriteStream(require('path').resolve('./dist/jadeTemplates.js'))).on('close', cb);
    })
});

require('gulpfile-boilerplate')(gulp);
gulp.task('watch', function(){
    gulp.watch(['src/**/*', 'views/**/*'], ['build']);
});
gulp.task('server', function(){
    require('child_process').fork('./application.js');
});
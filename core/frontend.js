var browserify = require('browserify'),
    File = require('vinyl'),
    path = require('path');

module.exports = {
    init: function (files, cb) {
        var basedir = path.resolve('.');
        var b = browserify({basedir: basedir});
        b.require(path.resolve(__dirname+'/../lib/page-express-mimicry.js'), {expose: 'engine'});
        b.add(new File({
            cwd: basedir,
            base: basedir,
            path: basedir,
            contents: new Buffer(
                ";if(window.history){" +
                    "var engine=require('engine');" +
                    files.map(function (path) {
                return "require('" + path + "')(engine)"
            }).join(';')+
            "}")
        }));
        b.bundle({}, function(err, data){
            if (err) throw new Error(err);
            cb(data);
        })
    }
};
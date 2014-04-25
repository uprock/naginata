module.exports = function(app){
    app.engine('jade', require('jade').__express);

    app.use(require('connect').static(process.cwd()+'/dist'));
    app.set('view engine', 'jade');
    app.set('request', function(path, cb){
        if (path.indexOf('https?') == 0) require('superagent').get(path).end(function(err, xhr){
            cb(err, xhr && xhr.text);
        });
        else {
            if (path.indexOf('/') == 0) path = '.'+path;
            if (path.indexOf('.') == 0) path = path.replace('.', process.cwd()+'/dist');
            require('fs').readFile(path, function(err, data){
                try {
                    cb(err, data.toString());
                } catch (e){
                    cb(e, undefined);
                }
            });
        }
    });
};
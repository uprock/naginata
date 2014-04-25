module.exports = function (app) {
    app.engine('jade', function (path, options, callback) {
        callback(null, window.jade.templates[path](options));
    });
    app.set('view engine', 'jade');
    app.set('views', require('path').resolve('./src/templates'));
    app.set('request', function (path, cb) {
        require('superagent').get(path).end(function (err, xhr) {
            cb(err, xhr && xhr.text);
        });
    });
};
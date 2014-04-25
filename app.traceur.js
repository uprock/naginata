Object.defineProperty(Array.prototype, 'compact', {value: function () {
    return this.filter(function (a) {
        return a
    })
}});

function runGenerator(gen) {
    var instance = gen(function resume() {
        instance.next(arguments);
    });
    instance.next();
};


module.exports = function init(cb) {
    if (!cb.call) throw new Error('You will not be able to launch app without callback which will receive application');
    runGenerator(function* (resume) {
        var path = require('path'),
            config = require(path.resolve('./package.json')),
            files = config.files,
            backendPaths = [
                path.resolve(files.backend), path.resolve(files.common)
            ].compact(),
            frontendPaths = [
                path.resolve(files.frontend), path.resolve(files.common)
            ].compact(),
            backend = require('./core/backend'),
            frontend = require('./core/frontend');
        var [client] = yield frontend.init(frontendPaths, resume);
        backend.useAsClientEngine(client);
        var [server] = yield backend.init(backendPaths, resume);


        cb(server);
    });
}
var express = require('express'),
    server = express();
module.exports = {
    init: function (files, cb) {
        files.forEach(function(file){
            require(file)(server);
        });
        process.nextTick(function(){
            cb(server);
        });
    },
    useAsClientEngine: function (clientFile) {
        if (!clientFile) throw new TypeError;
        server.get('/core.js', function(req, res){
            res.type('application/javascript');
            res.send(clientFile);
            res.end();
        })
    }
};
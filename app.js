require('traceur').require.makeDefault(function(filename){
    return filename.endsWith('traceur.js');
});
module.exports = require('./app.traceur.js');
module.exports = function (app) {
    var request = app.get('request');

    app.get('/:user', function (req, res) {
        request('./record.json', function (err,data) {
            if (err) throw err;
            data = JSON.parse(data);
            data.query = req.params;
            res.render('view', data);


        });
    });

    app.get('/', function (req, res) {
        request('./data.json', function (err,data) {
            if (err) throw err;
            res.render('list', JSON.parse(data));
        });
    });

    function getter(path, queryPath, templateName){
        app.get(path, function (req, res) {
            request(queryPath, function (err,data) {
                if (err) throw err;
                res.render(templateName, JSON.parse(data));
            });
        });
    }

    getter('/projects', '/projects', 'projectsList');
    getter('/projects/:name', '/projects?name= ', 'projectView');
};
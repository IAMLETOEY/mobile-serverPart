var auth = require(__root + '/src/commons/auth');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('https://www.baidu.com/#www');
    });
    // require('./api')(app, auth);
};

var http = require('http'),
    user = require('../lib/user');

exports.index = function(req, res){
  res.render('index', { activeTab: 'home', title: 'Express' })
};


exports.outside = function(req, res) {
  var lat = req.query.lat;
  var long = req.query.long;
  var data = "";

    var sapiRequest = "http://api.sensis.com.au/ob-20110511/test/search?location=" + lat + "," + long + "&key=" + process.env['SAPI_KEY'];
  http.get(sapiRequest, function(sapiRes) {
    sapiRes.on('data', function(d) {
        data += d;
    });
    sapiRes.on('end', function(d) {
        res.render('outside', {lat: lat, long: long, data: JSON.parse(data)});
    })
  });

};

exports.highscores = function(req, res, next) {
    user.list(
        { limit: 10, sortby: 'leads', sortorder: 'desc'},
        function(err, results) {
            if (err) {
                next(err);
            } else {
                res.render('highscores', {
                    title: 'High Scores',
                    activeTab: 'highscores',
                    topten: results
                });
            }
        }
    );
};

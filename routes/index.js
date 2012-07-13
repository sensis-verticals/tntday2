var request = require('request'),
    fs = require('fs'),
    user = require('../lib/user'),
    business = require('./business');

exports.index = function(req, res){
  res.render('index', { activeTab: 'home', title: 'Express' })
};

function getSapiResponse(latitude, longitude, callback) {
  var sapiRequest = "http://api.sensis.com.au/ob-20110511/test/search?location=" + latitude + "," + longitude + "&key=" + process.env['SAPI_KEY'],
      data = "";

  request(
      {
          method: 'GET',
          uri: sapiRequest,
          proxy: process.env.http_proxy
      },
      function(err, sapiRes) {
          callback(null, JSON.parse(sapiRes.body));
      }
  );
}

function readDummySapiData(latitude, longitude, callback) {
    fs.readFile('./routes/dummy_sapi_data.json', 'utf8', function(err, data) {
        if (data) {
            callback(err, JSON.parse(data));
        } else {
            callback(err);
        }
    });
}

exports.outside = function(req, res) {
  var lat = req.query.lat;
  var long = req.query.long;
  var getSapiData = process.env['FINDR_STUBBED'] ? readDummySapiData : getSapiResponse;

  getSapiData(lat, long, function(err, data) {
    res.render('outside', {lat: lat, long: long, data: data});
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

exports.user = function(req, res, next) {
    user.get(req.param('id'), function(err, foundUser) {
        if (err) {
            next(err);
        } else {
            res.render('user', {
                user: foundUser
            });
        }
    });
};

exports.splash = function (req, res, next) {
  res.render('splash', {});
}

exports.list = function (req, res, next) {
        var lat = req.query.lat;
        var long = req.query.long;
        var getSapiData = process.env['FINDR_STUBBED'] ? readDummySapiData : getSapiResponse;

        getSapiData(lat, long, function(err, data) {
                console.log("data sent is: " + JSON.stringify(data));
                res.render('list', {lat: lat, long: long, data: data});
        });
}

exports.form = function (req, res, next) {
  res.render('form', {});
}

exports.successful = function (req, res, next) {
  res.render('successful', {});
}

exports.addBusiness = business.addBusiness;

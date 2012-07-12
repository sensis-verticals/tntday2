var http = require('http'),
fs = require('fs');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

function getSapiResponse(latitude, longitude, callback) {
  var sapiRequest = "http://api.sensis.com.au/ob-20110511/test/search?location=" + latitude + "," + longitude + "&key=" + process.env['SAPI_KEY'],
  data = "";

  http.get(sapiRequest, function(sapiRes) {
    sapiRes.on('data', function(d) {
        data += d;
    });
    sapiRes.on('end', function(d) {
        callback(null, JSON.parse(data));
    });
  });
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
var http = require('http');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};


exports.outside = function(req, res) {
  var lat = req.query.lat;
  var long = req.query.long;
  var data = "";

  var sapiRequest = "http://api.sensis.com.au/ob-20110511/test/search?location=" + lat + "," + long + "&key=XXX";
  http.get(sapiRequest, function(sapiRes) {
    sapiRes.on('data', function(d) {
        data += d;
    });
    sapiRes.on('end', function(d) {
        res.render('outside', {lat: lat, long: long, data: JSON.parse(data)});
    })
  });

};
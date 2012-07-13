var redis = require('redis'),
util = require('util'),
async = require('async'),
client = redis.createClient(),
NEXT_BUSINESS_KEY_KEY = "nextBusinessKey";

function updateLeaderBoard(userId, callback) {
    if (userId) {
        client.zincrby("users:leads", 1, userId, function(error) { callback(error); });
    } else {
        callback(null);
    }
}

function getNextBusinessKey(callback) {
    client.incr(NEXT_BUSINESS_KEY_KEY, callback);
}

function insertBusiness(key, business, callback) {
    business.id = key;
    console.log('inserting business with key=' + key + ', business=' + util.inspect(business));
    async.series([
        function(cb) {
            client.hmset('business:' + key, business, cb);
        },
        function(cb) {
            client.sadd('user:'+business.user+':businesses', business.id, cb);
        }
    ], function(err) {
        callback(err);
    });
}

function getUserRank(userId, callback) {
    client.zrevrank("users:leads", userId, function(err, rank) {
        callback(err, rank ? rank+1 : rank);
    });
}

exports.addBusiness = function(req, res) {
    var body = req.body;
    
    async.waterfall([
        getNextBusinessKey,
        function(key, cb) { insertBusiness(key, body, cb); },
        function(cb) { updateLeaderBoard(body.user, cb); },
        function(cb) { getUserRank(body.user, cb); }
    ], function(err, rank) {
        if (err) {
            res.send(500, err);
        } else {
            console.log("user " + body.user + " is now ranked #" + rank);
            res.render('successful', { 
                userRank: rank
            });
        }
    });
};
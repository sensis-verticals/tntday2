var redis = require('redis'),
    client = redis.createClient();

module.exports = User;

/**
 *  represents a user object
 */
function User(id, leads) {
    this.id = id;
    this.leads = leads;
}


/**
 * Returns an array of users.
 * Options can include
 *  - limit
 *  - sortby ("leads")
 *  - sortorder ("asc|desc")
 */
User.list = function(options, cb) {
    var command = options.sortorder === 'asc' ? 'zrange' : 'zrevrange',
        key = 'users:' + (options.sortby || 'leads'),
        start = options.skip || 0,
        end = (start + (options.limit || 10)) -1;

    client[command](key, start, end, 'withscores', function(err, results) {
        var users = [];
        if (err) {
            cb(err);
        } else {
            while (results.length) {
                users.push(new User(results.shift(), results.shift()));
            }
            cb(null, users);
        }
    });
};

/**
 * Returns a single user, with a list of their businesses
 * - arg is user id
 */
User.get = function(id, cb) {
    var user,
        businesses = [];

    client.multi()
    .get('user:'+id+':leads')
    .sort('user:'+id+':businesses', 'by', 'nosort', 'GET', 'business:*->businessname', 'GET', 'business:*->address')
    .exec(function(err, replies) {
        if (err) {
            cb(err);
        } else {
            user = new User(id, replies[0]);
            while(replies[1].length) {
                businesses.push({ businessname: replies[1].shift(), address: replies[1].shift() });
            }
            user.businesses = businesses;
            cb(null, user);
        }
    });
};

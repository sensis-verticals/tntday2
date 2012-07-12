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

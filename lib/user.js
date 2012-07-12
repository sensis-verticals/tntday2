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
User.list = function(options) {
    return [ { id: 'w79623', leads: 27 }, { id: 'w12345', leads: 15 } ];
};

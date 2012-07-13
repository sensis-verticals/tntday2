var redis = require('redis'),
    client = redis.createClient(),
    testUsers = [
	{ id: 'Emperor Palpatine', leads: 27 },
	{ id: 'Count Dooku', leads: 22 },
	{ id: 'Yoda', leads: 18 },
	{ id: 'Darth Vader', leads: 17 },
	{ id: 'Luke Skywalker', leads: 15 },
	{ id: 'R2D2', leads: 3 },
	{ id: 'Leia Organa', leads: 2 },
	{ id: 'Lando Calrissian', leads: 2 },
	{ id: 'Han Solo', leads: 0 },
	{ id: 'Mace Windu', leads: 182 },
	{ id: 'Jar Jar Binks', leads: 0 }
    ],
    testLeads = [
        { id: 1, businessname: 'Cheese', address: '123 cheese st, cheese, vic 1234', user: 'Emperor Palpatine' },
        { id: 2, businessname: 'Cheese', address: '123 cheese st, cheese, vic 1234', user: 'Mace Windu' },
        { id: 3, businessname: 'Cheese', address: '123 cheese st, cheese, vic 1234', user: 'Mace Windu' },
        { id: 4, businessname: 'Cheese', address: '123 cheese st, cheese, vic 1234', user: 'Mace Windu' }
    ];

client.on('error', function(err) {
    console.log("Error: " + err);
});

client.flushdb(redis.print);

testUsers.forEach(function(user) {
    client.set("user:" + user.id + ":leads", user.leads, redis.print);
    client.zadd("users:leads", user.leads, user.id, redis.print);
});

testLeads.forEach(function(lead) {
    client.hmset('business:'+lead.id, lead, redis.print);
    client.sadd('user:'+lead.user+':businesses', lead.id, redis.print);
});

client.quit();

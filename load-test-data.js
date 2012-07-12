var redis = require('redis'),
    client = redis.createClient(),
    testData = [
	{ id: 'Emperor Palpatine', leads: 27 },
	{ id: 'Count Dooku', leads: 22 },
	{ id: 'Yoda', leads: 18 },
	{ id: 'Darth Vader', leads: 17 },
	{ id: 'Luke Skywalker', leads: 15 },
	{ id: 'R2D2', leads: 3 },
	{ id: 'Leia', leads: 2 },
	{ id: 'Lando Calrissian', leads: 2 },
	{ id: 'Han Solo', leads: 0 },
	{ id: 'Mace Windu', leads: 182 },
	{ id: 'Jar Jar Binks', leads: 0 }
    ];

client.on('error', function(err) {
    console.log("Error: " + err);
});

client.flushdb(redis.print);

testData.forEach(function(user) {
    client.set("user:" + user.id + ":leads", user.leads, redis.print);
    client.zadd("users:leads", user.leads, user.id, redis.print);
});

client.quit();

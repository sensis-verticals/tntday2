tntday2
=======

Demo created for Sensis TNT Day 2

Things to install
-----------------

* node 0.8.1 (use nvm)
* you'll need to upgrade npm to 1.1.35 (otherwise you can't use npm behind our proxy)
	* git clone http://github.com/isaacs/npm.git
	* cd npm
	* make install
* redis
	* wget http://redis.googlecode.com/files/redis-2.4.15.tar.gz
	* tar xzf redis-2.4.15.tar.gz
	* cd redis-2.4.15
	* make
	* ./src/redis-server
	
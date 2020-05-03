sudo service mongod start
sudo forever --minUptime 5 --spinSleepTime 5 server.js > logs.txt &

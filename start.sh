sudo mongod --port 27017 &
sudo forever --minUptime 5 --spinSleepTime 5 server.js > logs.txt &
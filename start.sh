sudo mongod --port 20017 &
sudo forever --minUptime 5 --spinSleepTime 5 server.js > logs.txt &
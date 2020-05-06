# this file is started at crontab
# setup :
#           crontab -e
#           0 20 * * * sh /path/to/db_backup.sh

mongodump --port 20017
date_tmp=$(date)
echo $date_tmp >> /home/apl/smartp/seelock_ui/dump_time.log

mv dump/ /home/apl/smartp/seelock_ui/dumps/
#mv dump $date_tmp
rm -rf dump/
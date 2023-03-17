#!/bin/bash
echo "0 5 * * * python /backend/download_data.py --bulk" >> /etc/cron.d/download-crontab
echo "* * * * * python -c 'from datetime import datetime;print(datetime.now())' > /tmp/timenow.txt" >> /etc/cron.d/download-crontab
chmod 0644 /etc/cron.d/download-crontab
crontab /etc/cron.d/download-crontab
service cron start
python manage.py makemigrations && python manage.py migrate &&  python  population_script.py & python download_data.py --bulk &&  python manage.py runserver 0.0.0.0:8000

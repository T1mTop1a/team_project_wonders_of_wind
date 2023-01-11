#!/bin/bash
echo "* * * * * /usr/local/lib/python3.9 /backend/backend/download_data.py" > /etc/cron.d/download-crontab
chmod 0644 /etc/cron.d/download-crontab
crontab /etc/cron.d/download-crontab
service cron start
python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000

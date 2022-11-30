cd $PROJECT_BACKEND
source venv/bin/activate
kill -9 $(ps aux | grep celery | grep -v grep | awk '{print $2}' | tr '\n'  ' ') > /dev/null 2>&1
celery -A backend worker -l info --logfile=celery.log --detach
celery -A backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler --detach
gunicorn --worker-tmp-dir /dev/shm backend.wsgi


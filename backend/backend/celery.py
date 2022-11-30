from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
# from dataloader import tasks
from celery.schedules import crontab

from celery.schedules import crontab
# from celery.task import periodic_task

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend', namespace="CELERY")
app.config_from_object('django.conf:settings')
app.autodiscover_tasks()


#
# @periodic_task(run_every=crontab(hour="*", minute="*"))
# def every_monday_morning():
#     print("This is run every Monday morning at 7:30")
#


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


app.conf.beat_schedule = {
    # Scheduler Name
    'download every 1am': {
        # Task Name (Name Specified in Decorator)
        'task': 'daily_download',
        # Schedule
        'schedule': crontab(minute='0', hour='1'),
        # Function Arguments

    },

}

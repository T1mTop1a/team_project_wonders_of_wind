from __future__ import absolute_import, unicode_literals

import datetime
import os
import logging
import pygrib
import requests
import numpy as np
from pathlib import Path
import importlib
from dataloader.dataloader import DataLoader
import argparse

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django

django.setup()

from project_backend.models import WeatherData
from django.db.utils import IntegrityError


def download(start, start_hours, end_hours, bulk, chunks):
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logging.basicConfig(filename=f'downloads_{start}.log', filemode='w', level=logging.DEBUG)
    dl = DataLoader(logger=logger)

    today = start
    d, m, y = today.day, today.month, today.year
    start_of_day = datetime.datetime(y, m, d, 0, 0, 0)

    download_dir = Path.cwd() / 'weather_downloads'
    download_dir.mkdir(exist_ok=True)

    with (download_dir / f'forecasts_{today}.csv').open('w') as forecast_file:
        forecast_file.write('time,type,yval,xval,value\n')
        for time in range(start_hours, end_hours + 1, 3):
            file = dl.get_time(time)
            time_str = start_of_day + datetime.timedelta(hours=time)

            gribfile = pygrib.open(str(file))

            gribfile.seek(0)
            u_comp = gribfile[11].values
            v_comp = gribfile[12].values
            wind_speed = np.sqrt(u_comp ** 2 + v_comp ** 2)
            downloaded_data = {
                'wind_speed': wind_speed,
                'temp': gribfile[16].values,
                'surface_pressure': gribfile[623].values
            }

            for key, value in downloaded_data.items():
                inserts = []

                rows, cols = value.shape
                for row in range(rows):
                    for col in range(cols):

                        wd = WeatherData(
                            height=0.0,
                            value_type=key,
                            time=time_str,
                            source='NOAA',
                            unit_of_measurement='NaN',
                            location_x=col,
                            location_y=row,
                            value=value[row, col]
                        )
                        if bulk:
                            inserts.append(wd)
                        else:
                            try:
                                wd.save()
                            except IntegrityError as ie:
                                pass

                if len(inserts):
                    insert_chunks = [inserts[i::chunks] for i in range(chunks)]

                    for chunk in insert_chunks:
                        saved = WeatherData.objects.bulk_create(chunk)

            # for key, value in downloaded_data.items():
            #     rows, cols = value.shape
            #     outputStr = '\n'.join(
            #         f'{time_str},{key},{row},{col},{value[row, col]}' for col in range(cols) for row in range(rows))
            #     forecast_file.write(outputStr)
            dl.cleanup()

    dl.cleanup()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Weather Data download script")

    parser.add_argument("--start_date", help="Date to download from", default=datetime.date.today())
    parser.add_argument("--start_hours", help="hour of the day to start downloading from", default=3)
    parser.add_argument("--end_hours", help="hour of the day to end downloading at", default=24)
    parser.add_argument('--bulk', help="Do bulk creates - not recommended on low spec machines",
                        action='store_true')
    parser.add_argument('--chunks', help="when bulk creating how many units to split the data into before crating",
                        default=8)
    args = parser.parse_args()

    download(args.start_date, int(args.start_hours), int(args.end_hours), args.bulk, int(args.chunks))

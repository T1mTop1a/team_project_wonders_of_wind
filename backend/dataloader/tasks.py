from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import datetime
from dataloader.dataloader import DataLoader
import pygrib
import datetime
from pathlib import Path
import logging
import numpy as np

@shared_task('download_update')
def download_update():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logging.basicConfig(filename=f'downloads_{datetime.date.today()}.log', filemode='w', level=logging.DEBUG)
    dl = DataLoader(logger=logger)

    today = datetime.date.today()
    d, m, y = today.day, today.month, today.year
    start_of_day = datetime.datetime(y, m, d, 0, 0, 0)

    download_dir = Path.cwd() / 'weather_downloads'
    download_dir.mkdir(exist_ok=True)

    with (download_dir / f'forecasts_{today}.csv').open('w') as forecast_file:
        forecast_file.write('time,type,yval,xval,value\n')
        for time in range(3, 25, 3):
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
                rows, cols = value.shape
                outputStr = '\n'.join(
                    f'{time_str},{key},{row},{col},{value[row, col]}' for col in range(cols) for row in range(rows))
                forecast_file.write(outputStr)
            dl.cleanup()
    dl.cleanup()





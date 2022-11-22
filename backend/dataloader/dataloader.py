import datetime
import os
import logging
import pygrib
import requests
import numpy as np


class DataLoader:

    def __init__(self, date=datetime.date.today(), model_cycle='00', degree_resolution='1p00',
                 logger=logging.getLogger(__name__)):
        self.logger = logger
        self.logger.debug(f'{date}, {model_cycle}, {degree_resolution}')
        self.noaa_backend = 'https://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod'

        day, month, year = date.day, date.month, date.year
        self.filename = f"{self.noaa_backend}/gfs.{year}{month}{day}/{model_cycle}/atmos/gfs.t{model_cycle}z.pgrb2.{degree_resolution}.f"
        self.logger.debug(f'filename = {self.filename}')
        self.downloaded_files = []

    def get_time(self, time: int, output_path=os.path.join(os.getcwd(), 'weather_downloads'), overwrite=True):

        download_filename = self.filename + str(time).rjust(3, '0')
        self.logger.info(f'download {download_filename} to {output_path}')
        download_path = os.path.join(output_path, download_filename.split('/')[-1])
        if os.path.exists(download_path):
            if overwrite:
                os.remove(download_path)
            else:
                raise FileExistsError("file exists and overwrite is not set")

        with requests.get(download_filename, stream=True) as r:
            r.raise_for_status()
            with open(download_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)

        # This should only happen if the download was successful
        self.downloaded_files.append(download_path)

        return download_path

    def cleanup(self):
        for filepath in self.downloaded_files:
            self.logger.info(f'Deleting {filepath}')
            os.remove(filepath)

        self.downloaded_files = []


if __name__ == '__main__':
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logging.basicConfig(filename=f'downloads_{datetime.date.today()}.log', filemode='w', level=logging.DEBUG)
    dl = DataLoader(logger=logger)

    today = datetime.date.today()
    d, m, y = today.day, today.month, today.year
    start_of_day = datetime.datetime(y, m, d, 0, 0, 0)

    with open(f'weather_downloads/forecasts_{today}.csv', 'w') as forecast_file:
        forecast_file.write('time,type,yval,xval,value\n')
        for time in range(3, 25, 3):
            file = dl.get_time(time)
            time_str = start_of_day + datetime.timedelta(hours=time)

            gribfile = pygrib.open(file)

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

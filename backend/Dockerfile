FROM ubuntu:18.04
FROM python:3.9
COPY . /backend
WORKDIR /backend
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
RUN apt update
RUN apt -y install libnetcdff-dev libopenjp2-7-dev gfortran make unzip git cmake wget
RUN apt -y install libeccodes-dev
RUN pip3 install eccodes
RUN   pip install -r requirements.txt && \
      apt update && apt install cron --assume-yes && \
      python manage.py collectstatic --noinput
EXPOSE 8000
CMD [ "/bin/sh", "docker-runserver.sh" ]

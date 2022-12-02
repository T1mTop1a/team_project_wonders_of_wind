FROM python:3
COPY . /backend
WORKDIR /backend
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
RUN   echo "python manage.py migrate && python manage.py runserver 0.0.0.0:8000" > start.sh
RUN   pip install -r requirements.txt && \
      python manage.py collectstatic --noinput
EXPOSE 8000
CMD [ "/bin/sh", "start.sh" ]

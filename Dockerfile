FROM backend as backend
FROM node:16.16.0-alpine AS frontend
COPY ./frontend /frontend
WORKDIR /frontend
RUN   echo "REACT_APP_BACKEND=http://localhost:4000" > .env
RUN   npm install && \
      npm run build

FROM nginx
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend /frontend/build/ /wow/
COPY --from=backend /backend/static/admin /wow/static/admin

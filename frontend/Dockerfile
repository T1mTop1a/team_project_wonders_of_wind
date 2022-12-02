FROM node:16.16.0-alpine AS env
FROM env as build
COPY . /frontend
WORKDIR /frontend
RUN   npm install && \
      npm run build
EXPOSE 3000
CMD [ "npm", "start" ]

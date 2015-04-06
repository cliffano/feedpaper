FROM node:0.12.0

MAINTAINER Cliffano Subagio (blah@cliffano.com)

EXPOSE 9000

RUN node --version
RUN npm --version

ADD . /app/stage
WORKDIR /app/stage

RUN npm install .
CMD NODE_ENV=production /app/stage/bin/feedpaper start --feeds-file /app/data/feeds.json --conf-dir /app/conf/ --cache-db-dir /app/data/feedpaper.db
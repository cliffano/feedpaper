FROM node:0.10-slim

MAINTAINER Cliffano Subagio (blah@cliffano.com)

EXPOSE 9000

RUN node --version
RUN npm --version

ADD . /app/feedpaper
WORKDIR /app/feedpaper

RUN npm link
CMD /usr/local/bin/feedpaper start

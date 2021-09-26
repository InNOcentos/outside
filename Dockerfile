FROM node:16-bullseye

WORKDIR /usr/app
COPY . /usr/app

RUN npm install
RUN apt-get update && apt-get -y install nano vim && apt-get autoremove

CMD npm run start:dev
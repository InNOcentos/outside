FROM node:16-bullseye

WORKDIR /usr/app
COPY . /usr/app

RUN npm install

CMD npm run start:dev
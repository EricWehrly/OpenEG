FROM node:20-alpine

WORKDIR /app

ADD . /app

RUN yarn install

CMD ["yarn", "build"]

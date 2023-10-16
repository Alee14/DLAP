FROM node:alpine AS build

WORKDIR /usr/src/bot

RUN apk add --update alpine-sdk libtool autoconf automake python3

COPY package.json ./

COPY yarn.lock ./

RUN yarn global add node-gyp

RUN yarn install

FROM node:alpine

WORKDIR /usr/src/bot

COPY --from=build /usr/src/bot/node_modules ./node_modules

COPY . ./

CMD ["node", "bot.js"]

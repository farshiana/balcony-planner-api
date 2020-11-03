FROM node:12.18.3-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
RUN yarn global add cross-env
RUN yarn global add babel-cli

COPY package.json /usr/src/app
RUN yarn install

COPY . /usr/src/app

EXPOSE 3000
CMD ["yarn", "start"]

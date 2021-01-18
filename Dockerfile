FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY server.js .
COPY db.js .
COPY providers.js .
COPY orderResource.js .

EXPOSE 4500

CMD npm start
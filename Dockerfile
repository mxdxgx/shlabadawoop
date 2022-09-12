FROM node:16.13.1-alpine

COPY . /opt/app
WORKDIR /opt/app

RUN npm install --no-cache 

CMD ["node", "dist/src/server/server.js"]
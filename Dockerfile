FROM node:18.18.0

COPY . /opt/app
WORKDIR /opt/app

RUN npm install --no-cache 

CMD ["node", "--inspect=0.0.0.0:9229", "dist/src/server/server.js"]
FROM node:18.18.0

COPY . /opt/app
WORKDIR /opt/app

RUN npm install --no-cache 

CMD ["npm","run", "start-remote"]
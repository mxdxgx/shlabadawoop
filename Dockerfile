FROM node:18.20.6

COPY . /opt/app
WORKDIR /opt/app

RUN npm install --no-cache 

CMD ["npm","run", "start-remote"]
FROM node:16

RUN mkdir -p /usr/src/gis_service
WORKDIR /usr/src/gis_service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7005

CMD [ "npm", "run", "serve" ]
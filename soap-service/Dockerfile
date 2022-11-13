FROM node:16

RUN mkdir -p /usr/src/soap_service
WORKDIR /usr/src/soap_service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6666

CMD [ "npm", "run", "serve" ]
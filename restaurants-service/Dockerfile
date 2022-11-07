FROM node:16

RUN mkdir -p /usr/src/restaurants_service
WORKDIR /usr/src/restaurants_service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "serve" ]
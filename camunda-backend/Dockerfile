FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# PATCH axios req

ENV PATH_PATCH ./src/patch/http.js
ENV HTTP_SOAP ./node_modules/soap/lib

RUN cp ${PATH_PATCH} ${HTTP_SOAP}

CMD [ "npm", "run", "start" ]
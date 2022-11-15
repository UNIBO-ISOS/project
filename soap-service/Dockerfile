FROM node:16

RUN mkdir -p /usr/src/soap_service
WORKDIR /usr/src/soap_service

COPY package*.json ./

RUN npm install

COPY . .

# PATCH axios req

ENV PATH_PATCH ./src/wsdl/http.js
ENV HTTP_SOAP ./node_modules/soap/lib

RUN cp ${PATH_PATCH} ${HTTP_SOAP}

EXPOSE 6666

CMD [ "npm", "run", "serve" ]
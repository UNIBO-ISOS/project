# syntax=docker/dockerfile:1

FROM golang:1.16-alpine

WORKDIR /app

COPY . .

RUN go get github.com/gin-gonic/gin
RUN go build .

EXPOSE 3001

CMD [ "./customer-server" ]
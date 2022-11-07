FROM ruby:3.1.2

ENV LANG=C.UTF-8

RUN apt-get update  && apt-get install -y npm && npm install -g yarn

RUN mkdir -p /var/courier-service
COPY . /var/courier-service
WORKDIR /var/courier-service

RUN bundle install

EXPOSE 3000

CMD ["rails", "s", "-b", "0.0.0.0"]

FROM ruby:3.1.2

# Default directory
ENV INSTALL_PATH /opt/app
# removes pid of old application's execution
#RUN mkdir -p $INSTALL_PATH

RUN rm -f /opt/app/tmp/pids/server.pid

# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app
WORKDIR /opt/app
COPY . .

RUN bundle install

EXPOSE 3000

CMD ["rails", "s", "-b", "0.0.0.0"]
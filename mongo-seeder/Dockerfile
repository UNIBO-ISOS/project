FROM mongo:5.0
 # Will be set through Environment Files
 ARG DATABASE_URI

 ENV DATABASE_URI ${DATABASE_URI}

 COPY restaurants.json /restaurants.json
 COPY cities.json /cities.json
 COPY couriers.json /couriers.json

 CMD mongoimport --uri ${DATABASE_URI} --collection restaurants --drop --jsonArray --type json --file /restaurants.json && \
    mongoimport --uri ${DATABASE_URI} --collection cities --drop --jsonArray --type json --file /cities.json && \
    mongoimport --uri ${DATABASE_URI} --collection couriers --drop --jsonArray --type json --file /couriers.json
import { Client, logger } from 'camunda-external-task-client-js';

import * as dotenv from 'dotenv';
import { RetreiveCities, ReturnCities } from './services/cities.service';
import { RetreiveRestaurants, ReturnRestaurants } from './services/restaurants.service';

dotenv.config();
// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: process.env.CAMUNDA_HOST!, use: logger, asyncResponseTimeout: 10000 };

const client = new Client(config);

client.subscribe('retrieve-cities', RetreiveCities)
client.subscribe('return-cities', ReturnCities)

client.subscribe('retrieve-restaurants', RetreiveRestaurants)
client.subscribe('return-restaurants', ReturnRestaurants)
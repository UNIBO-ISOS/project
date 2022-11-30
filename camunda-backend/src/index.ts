import { Client, logger } from 'camunda-external-task-client-js';

import * as dotenv from 'dotenv';

dotenv.config();

import * as mongoose from 'mongoose';
import { verifyToken } from './services/bank.service';
import { RetreiveCities, ReturnCities } from './services/cities.service';
import { SelectCourier, SendCourierRequest, UpdateList } from './services/couriers.service';
import { AskCouriersInRange } from './services/gis.service';
import { CreateNewOrder } from './services/order.service';
import { AskRestaurantAvailability, RetreiveRestaurants, ReturnRestaurants, SendRestaurantNotUpdated, SendRestaurantUpdated, UpdateRestaurantInfo, VerifyUpdateConditions } from './services/restaurants.service';

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: process.env.CAMUNDA_HOST!, use: logger, asyncResponseTimeout: 10000 };
mongoose.connect('mongodb://mongo:27017/acme');

const client = new Client(config);

// City topics
client.subscribe('retrieve-cities', RetreiveCities)
client.subscribe('return-cities', ReturnCities)

// Restaurant topics
client.subscribe('retrieve-restaurants', RetreiveRestaurants)
client.subscribe('return-restaurants', ReturnRestaurants)
client.subscribe('restaurant-askAvailability', AskRestaurantAvailability)

client.subscribe('verify-update-conditions', VerifyUpdateConditions)
client.subscribe('update-restaurant', UpdateRestaurantInfo)
client.subscribe('unfeasable-restaurant-update', SendRestaurantNotUpdated)
client.subscribe('feasable-restaurant-update', SendRestaurantUpdated)

// Couriers topics
client.subscribe('courier-askAvailiability', SendCourierRequest)
client.subscribe('courier-update', UpdateList)
client.subscribe('courier-best', SelectCourier)

// Order topics
client.subscribe('create-order', CreateNewOrder)

// GIS topics
client.subscribe('gis-askCouriers', AskCouriersInRange)

// verify token
client.subscribe('verifyToken', verifyToken)
import { Client, logger } from 'camunda-external-task-client-js';

import * as dotenv from 'dotenv';

dotenv.config();

import * as mongoose from 'mongoose';
import { SendSuccessfulVerification, SendUnsuccessfulVerification, verifyToken } from './services/bank.service';
import { RetreiveCities, ReturnCities } from './services/cities.service';
import { SelectCourier, SendCourierRequest } from './services/couriers.service';
import { AskCouriersInRange } from './services/gis.service';
import { CreateNewOrder, impossibleToRefund, NotifyOrderCreated, NotifyOrderNotAvailable, RefundUser, SendOrderCancelled, SendOrderNotCancelled, VerifyCancelCondition } from './services/order.service';
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
// client.subscribe('courier-update', UpdateList)
client.subscribe('courier-best', SelectCourier)

// Order topics
client.subscribe('create-order', CreateNewOrder)
client.subscribe('send-order-created', NotifyOrderCreated)
client.subscribe('send-order-unavailable', NotifyOrderNotAvailable)
client.subscribe('send-unsuccessful-verification', SendUnsuccessfulVerification)
client.subscribe('send-successful-verification', SendSuccessfulVerification)
client.subscribe('verify-cancel-condition', VerifyCancelCondition)
client.subscribe('send-cancel-denied', SendOrderNotCancelled)
client.subscribe('refund-user', RefundUser)
client.subscribe('send-cancel-successful', SendOrderCancelled)
client.subscribe('send-refund-unsuccessful', impossibleToRefund)

// GIS topics
client.subscribe('gis-askCouriers', AskCouriersInRange)

// verify token
client.subscribe('verifyToken', verifyToken)
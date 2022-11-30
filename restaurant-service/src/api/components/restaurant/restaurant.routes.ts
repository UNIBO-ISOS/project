import express from 'express';
import { checkDeadline, checkUnavailability } from '../../util/util';
import { getAllRestaurants, getRestaurant, getRestaurantAvailability, notifyUnavailability, updateRestaurantInfo, updateRestaurants, waitForUpdateResponse } from './restaurant.controller';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:restaurantId', getRestaurant);
// update menu of restaurant
router.post('/:restaurantId', checkDeadline, updateRestaurants);
//notify unavailability
router.post('/:restaurantId/notifyUnavailability', checkUnavailability, notifyUnavailability)
// get availability of restaurants
router.get('/:restaurantId/availability', getRestaurantAvailability)

router.post('/:restaurantId/update', updateRestaurantInfo)
router.post('/:restaurantId/updateResponse', waitForUpdateResponse)

export { router };

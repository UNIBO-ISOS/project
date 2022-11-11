import express from 'express';
import { getAllRestaurants, updateRestaurants, notifyUnavailability, getRestaurant } from './restaurant.controller';
import { checkDeadline, checkUnavailability } from '../../util/util';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:restaurantId', getRestaurant);
// update menu of restaurant
router.post('/:restaurantId', checkDeadline, updateRestaurants);
//notify unavailability
router.post('/:restaurantId/notifyUnavailability', checkUnavailability, notifyUnavailability)
// todo: API

export { router }

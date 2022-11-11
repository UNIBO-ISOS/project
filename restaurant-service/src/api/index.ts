import express from 'express';

import { router as restaurantRouter } from './components/restaurant/restaurant.routes';

const router = express.Router();

router.use('/restaurants', restaurantRouter);

export { router };
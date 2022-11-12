import express from 'express';

import { router as courierRouter } from './components/courier/courier.routes';

const router = express.Router();

router.use('/couriers', courierRouter);

export { router };
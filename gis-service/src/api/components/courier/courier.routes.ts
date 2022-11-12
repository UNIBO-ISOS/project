import express from 'express';
import { getCouriers } from './courier.controller';

const router = express.Router();

router.get('/', getCouriers);

export { router };


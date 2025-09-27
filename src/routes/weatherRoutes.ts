import express from 'express';
import weatherController from '../controller/weatherController';

const router = express.Router();

// Public weather endpoint (no auth required)
router.get('/', (req, res) => weatherController.getWeather(req, res));

export default router;

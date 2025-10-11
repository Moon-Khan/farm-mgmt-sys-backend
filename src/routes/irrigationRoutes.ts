import express from 'express';
import irrigationController from '../controller/irrigationsController';
import { auth } from '../middleware/auth';

const irrigation = express.Router();

// Get all irrigations
irrigation.get("/", auth, (req, res) => irrigationController.getAllIrrigations(req, res));

// Get irrigations by plot
irrigation.get("/plot/:plotId", auth, (req, res) => irrigationController.getIrrigationsByPlot(req, res));

// Create irrigation record
irrigation.post("/", auth, (req, res) => irrigationController.createIrrigation(req, res));

export default irrigation;

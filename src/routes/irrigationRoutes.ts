import express from 'express';
import irrigationController from '../controller/irrigationsController';

const irrigation = express.Router();

irrigation.get("/", (req, res) => irrigationController.getAllIrrigations(req, res));
irrigation.get("/plot/:plotId", (req, res) => irrigationController.getIrrigationsByPlot(req, res));
irrigation.post("/", (req, res) => irrigationController.createIrrigation(req, res));


export default irrigation;

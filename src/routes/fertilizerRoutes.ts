import express from 'express';
import fertilizerController from '../controller/fertilizerController';

const fertilizers = express.Router();

fertilizers.get("/", (req, res) => fertilizerController.getAllFertilizers(req, res));
fertilizers.get("/plot/:plotId", (req, res) => fertilizerController.getFertilizersByPlot(req, res));
fertilizers.post("/", (req, res) => fertilizerController.createFertilizer(req, res));


export default fertilizers;


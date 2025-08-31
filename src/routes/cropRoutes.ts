import express from 'express';
import cropController from "../controller/cropController";

const crops = express.Router();

crops.get("/", (req, res) => cropController.getAllCrops(req, res));


export default crops;
import express from 'express';
import pesticideController from '../controller/pesticidesController';

const pesticides = express.Router();

pesticides.get("/", (req, res) => pesticideController.getAllPesticides(req, res));
pesticides.post("/", (req, res) => pesticideController.createPesticide(req, res));


export default pesticides;

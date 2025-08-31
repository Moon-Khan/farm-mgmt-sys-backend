import express from 'express';
import CaretakerController from "../controller/caretakerController";

const caretakers = express.Router();

caretakers.get("/", (req, res) => CaretakerController.getAllCaretakers(req, res));


export default caretakers;
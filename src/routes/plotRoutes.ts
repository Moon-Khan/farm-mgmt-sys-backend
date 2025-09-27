import express from 'express';
import { auth } from '../middleware/auth';
import plotController from "../controller/plotController";

const plots = express.Router();

// Require auth for all plot routes
plots.use(auth);

// GET /v1/plots - Get all plots with pagination and filtering
plots.get("/", (req, res) => plotController.getAllPlots(req, res));

// GET /v1/plots/status/:status - Get plots by status
plots.get("/status/:status", (req, res) => plotController.getPlotsByStatus(req, res));

// GET /v1/plots/:id - Get plot by ID
plots.get("/:id", (req, res) => plotController.getPlotById(req, res));

// POST /v1/plots - Create new plot
plots.post("/", (req, res) => plotController.createPlot(req, res));

// PUT /v1/plots/:id - Update plot
plots.put("/:id", (req, res) => plotController.updatePlot(req, res));

// DELETE /v1/plots/:id - Delete plot
plots.delete("/:id", (req, res) => plotController.deletePlot(req, res));

export default plots;
import express from 'express';
import { LifecycleController } from "../controller/lifecycleController";

const lifecyclecrops = express.Router();
const lifecycleController = new LifecycleController();

// Get all lifecycle events
lifecyclecrops.get("/", lifecycleController.getAllLifecycles.bind(lifecycleController));

// Get lifecycle event by ID
lifecyclecrops.get("/:id", lifecycleController.getLifecycleById.bind(lifecycleController));

// Create new lifecycle event
lifecyclecrops.post("/", lifecycleController.createLifecycle.bind(lifecycleController));

// Update lifecycle event
lifecyclecrops.put("/:id", lifecycleController.updateLifecycle.bind(lifecycleController));

// Delete lifecycle event
lifecyclecrops.delete("/:id", lifecycleController.deleteLifecycle.bind(lifecycleController));

// Get lifecycle events by plot
lifecyclecrops.get("/plot/:plotId", lifecycleController.getLifecyclesByPlot.bind(lifecycleController));

export default lifecyclecrops;
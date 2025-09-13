import express from 'express';
import { LifecycleController } from "../controller/lifecycleController";

const lifecyclecrops = express.Router();

// Get all lifecycle events
lifecyclecrops.get("/", LifecycleController.getAllLifecycles);

// Get lifecycle event by ID
lifecyclecrops.get("/:id", LifecycleController.getLifecycleById);

// Create new lifecycle event
lifecyclecrops.post("/", LifecycleController.createLifecycle);

// Update lifecycle event
lifecyclecrops.put("/:id", LifecycleController.updateLifecycle);

// Delete lifecycle event
lifecyclecrops.delete("/:id", LifecycleController.deleteLifecycle);

// Get lifecycle events by plot
lifecyclecrops.get("/plot/:plotId", LifecycleController.getLifecyclesByPlot);

export default lifecyclecrops;
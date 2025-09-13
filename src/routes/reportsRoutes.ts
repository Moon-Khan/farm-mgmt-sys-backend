import express from 'express';
import { ReportsController } from "../controller/reportsController";

const reports = express.Router();

// Get financial overview
reports.get("/financial", ReportsController.getFinancialOverview);

// Get crop yield analysis
reports.get("/crop-yield", ReportsController.getCropYieldAnalysis);

// Get resource efficiency data
reports.get("/efficiency", ReportsController.getResourceEfficiency);

// Get comprehensive dashboard data
reports.get("/dashboard", ReportsController.getDashboardData);

export default reports;

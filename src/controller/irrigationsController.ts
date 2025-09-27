// controllers/CropController.ts
import { BaseController } from "./basecontrotller";
import irrigationService from "../helpers/irrigationsService";
import { Request, Response } from "express";

class IrrigationController extends BaseController {
    
    // Get all irrigations
    async getAllIrrigations(req: Request, res: Response): Promise<void> {
        try {
            const result = await irrigationService.getAllIrrigations();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Irrigation retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve Irrigation"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve Irrigation");
        }
    }

    // Get irrigations by plot ID
    async getIrrigationsByPlot(req: Request, res: Response): Promise<void> {
        try {
            const { plotId } = req.params;
            const result = await irrigationService.getIrrigationsByPlot(Number(plotId));

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Plot irrigations retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve plot irrigations"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plot irrigations");
        }
    }

    // Create new irrigation record
    async createIrrigation(req: Request, res: Response): Promise<void> {
        try {
            const result = await irrigationService.createIrrigation(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Irrigation record created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create irrigation record"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create irrigation record");
        }
    }
}

export default new IrrigationController();

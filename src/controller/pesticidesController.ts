// controllers/CropController.ts
import { BaseController } from "./basecontrotller";
import PesticideService from "../helpers/pesticidesService";
import { Request, Response } from "express";

class PesticideController extends BaseController {
    
    // Get all pesticides
    async getAllPesticides(req: Request, res: Response): Promise<void> {
        try {
            const result = await PesticideService.getAllPesticides();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Pesticides retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve Pesticides"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve Pesticides");
        }
    }

    // Create new pesticide record
    async createPesticide(req: Request, res: Response): Promise<void> {
        try {
            const result = await PesticideService.createPesticide(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Pesticide record created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create pesticide record"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create pesticide record");
        }
    }
}

export default new PesticideController();

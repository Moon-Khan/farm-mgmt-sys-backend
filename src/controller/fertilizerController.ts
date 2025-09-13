// controllers/CropController.ts
import { BaseController } from "./basecontrotller";
import FertilizerService from "../helpers/fertilizerService";
import { Request, Response } from "express";

class FertilizerController extends BaseController {
    
    // Get all fertilizers
    async getAllFertilizers(req: Request, res: Response): Promise<void> {
        try {
            const result = await FertilizerService.getAllFertilizers();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Fertilizers retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve fertilizers"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve fertilizers");
        }
    }

    // Create new fertilizer record
    async createFertilizer(req: Request, res: Response): Promise<void> {
        try {
            const result = await FertilizerService.createFertilizer(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Fertilizer record created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create fertilizer record"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create fertilizer record");
        }
    }
}

export default new FertilizerController();

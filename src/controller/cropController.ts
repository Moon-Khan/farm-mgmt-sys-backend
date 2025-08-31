// controllers/CropController.ts
import { BaseController } from "./basecontrotller";
import CropService from "../helpers/cropService";
import { Request, Response } from "express";

class CropController extends BaseController {
    
    // Get all crops (no pagination for now, keep it simple)
    async getAllCrops(req: Request, res: Response): Promise<void> {
        try {
            const result = await CropService.getAllCrops();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Crops retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve crops"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve crops");
        }
    }
}

export default new CropController();

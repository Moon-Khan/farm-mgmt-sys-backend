// controllers/CropController.ts
import { BaseController } from "./basecontroller";
import CropService from "../helpers/cropService";
import { Request, Response } from "express";
import caretakerService from "../helpers/caretakerService";

class CaretakerController extends BaseController {
    
    // Get all crops (no pagination for now, keep it simple)
    async getAllCaretakers(req: Request, res: Response): Promise<void> {
        try {
            const result = await caretakerService.getAllCaretakers();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Caretakers retrieved successfully"
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

export default new CaretakerController();

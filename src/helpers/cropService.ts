// helpers/cropService.ts
import { Crop } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class CropService {
    async getAllCrops(): Promise<ServiceResponse<Crop[]>> {
        try {
            const crops = await Crop.findAll({
                attributes: ["id", "name"]
            });

            return {
                success: true,
                data: crops
            };
        } catch (error) {
            console.error("Error in CropService.getAllCrops:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new CropService();

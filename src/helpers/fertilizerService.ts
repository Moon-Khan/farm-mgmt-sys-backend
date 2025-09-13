// helpers/cropService.ts
import { Fertilizer } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class FertilizerService {
    async getAllFertilizers(): Promise<ServiceResponse<Fertilizer[]>> {
        try {
            const fertilizer = await Fertilizer.findAll({
            });

            return {
                success: true,
                data: fertilizer
            };
        } catch (error) {
            console.error("Error in FertilizerService.getAllFertilizers:", error);
            return {    
                success: false,
                errors: [error]
            };
        }
    }

    async createFertilizer(fertilizerData: any): Promise<ServiceResponse<Fertilizer>> {
        try {
            const fertilizer = await Fertilizer.create(fertilizerData);

            return {
                success: true,
                data: fertilizer
            };
        } catch (error) {
            console.error("Error in FertilizerService.createFertilizer:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new FertilizerService();

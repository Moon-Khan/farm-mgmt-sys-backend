// helpers/cropService.ts
import { Irrigation } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class IrrigationService {
    async getAllIrrigations(): Promise<ServiceResponse<Irrigation[]>> {
        try {
            const irrigation = await Irrigation.findAll({
            });

            return {
                success: true,
                data: irrigation
            };
        } catch (error) {
            console.error("Error in IrrigationService.getAllIrrigations:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async createIrrigation(irrigationData: any): Promise<ServiceResponse<Irrigation>> {
        try {
            const irrigation = await Irrigation.create(irrigationData);

            return {
                success: true,
                data: irrigation
            };
        } catch (error) {
            console.error("Error in IrrigationService.createIrrigation:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new IrrigationService();

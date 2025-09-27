// helpers/cropService.ts
import { Pesticide } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class PesticideService {
    async getAllPesticides(): Promise<ServiceResponse<Pesticide[]>> {
        try {
            const pesticide = await Pesticide.findAll({
            });

            return {
                success: true,
                data: pesticide
            };
        } catch (error) {
            console.error("Error in PesticideService.getAllPesticides:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async getPesticidesByPlot(plotId: number): Promise<ServiceResponse<Pesticide[]>> {
        try {
            const pesticides = await Pesticide.findAll({
                where: {
                    plot_id: plotId
                }
            });

            return {
                success: true,
                data: pesticides
            };
        } catch (error) {
            console.error("Error in PesticideService.getPesticidesByPlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async createPesticide(pesticideData: any): Promise<ServiceResponse<Pesticide>> {
        try {
            const pesticide = await Pesticide.create(pesticideData);

            return {
                success: true,
                data: pesticide
            };
        } catch (error) {
            console.error("Error in PesticideService.createPesticide:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new PesticideService();

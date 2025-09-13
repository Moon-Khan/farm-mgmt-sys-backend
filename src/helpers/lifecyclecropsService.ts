// helpers/lifecyclecropsService.ts
import { CropLifecycle, Plot, Crop } from "../models";
import { ServiceResponse } from "./index";

class LifecyclecropService {
    async getAllLifecyclecrops(): Promise<ServiceResponse<CropLifecycle[]>> {
        try {
            const lifecycles = await CropLifecycle.findAll({
                include: [
                    {
                        model: Plot,
                        as: 'plot',
                        attributes: ['id', 'name', 'acreage']
                    },
                    {
                        model: Crop,
                        as: 'crop',
                        attributes: ['id', 'name', 'variety']
                    }
                ],
                order: [['date', 'DESC']]
            });

            return {
                success: true,
                data: lifecycles
            };
        } catch (error) {
            console.error("Error in LifecyclecropService.getAllLifecyclecrops:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async getLifecyclesByPlot(plotId: number): Promise<ServiceResponse<CropLifecycle[]>> {
        try {
            const lifecycles = await CropLifecycle.findAll({
                where: { plot_id: plotId },
                include: [
                    {
                        model: Plot,
                        as: 'plot',
                        attributes: ['id', 'name', 'acreage']
                    },
                    {
                        model: Crop,
                        as: 'crop',
                        attributes: ['id', 'name', 'variety']
                    }
                ],
                order: [['date', 'DESC']]
            });

            return {
                success: true,
                data: lifecycles
            };
        } catch (error) {
            console.error("Error in LifecyclecropService.getLifecyclesByPlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async createLifecycle(lifecycleData: any): Promise<ServiceResponse<CropLifecycle>> {
        try {
            const lifecycle = await CropLifecycle.create(lifecycleData);
            
            // Fetch the created lifecycle with associations
            const createdLifecycle = await CropLifecycle.findByPk(lifecycle.id, {
                include: [
                    {
                        model: Plot,
                        as: 'plot',
                        attributes: ['id', 'name', 'acreage']
                    },
                    {
                        model: Crop,
                        as: 'crop',
                        attributes: ['id', 'name', 'variety']
                    }
                ]
            });

            return {
                success: true,
                data: createdLifecycle!
            };
        } catch (error) {
            console.error("Error in LifecyclecropService.createLifecycle:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new LifecyclecropService();

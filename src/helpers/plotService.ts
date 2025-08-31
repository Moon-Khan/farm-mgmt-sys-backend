import { Plot, Caretaker, Crop } from "../models";
import { ServiceResponse, PaginationOptions } from "./index";


class PlotService {
    
    // Get all plots with pagination and filtering
    async getAllPlots(
        pagination?: PaginationOptions,
        filters?: {
            status?: string;
            caretaker_id?: number;
            current_crop_id?: number;
        }
    ): Promise<ServiceResponse<{ items: Plot[]; total: number }>> {
        try {
            const where: any = {};
            
            if (filters?.status) {
                where.status = filters.status;
            }
            if (filters?.caretaker_id) {
                where.caretaker_id = filters.caretaker_id;
            }
            if (filters?.current_crop_id) {
                where.current_crop_id = filters.current_crop_id;
            }

            const include = [
                {
                    model: Caretaker,
                    as: "caretaker",
                    attributes: ["id", "name", "contact_info"]
                },
                {
                    model: Crop,
                    as: "current_crop",
                    attributes: ["name" ]
                }
            ];

            const options: any = {
                where,
                include
            };

            if (pagination) {
                const offset = (pagination.page - 1) * pagination.limit;
                options.limit = pagination.limit;
                options.offset = offset;
                options.order = [[pagination.sortBy, pagination.sortOrder]];
            }

            console.log("OPTIONS", options);    

            const { count, rows } = await Plot.findAndCountAll(options);
            
            return {
                success: true,
                data: {
                    items: rows,
                    total: count
                }
            };
        } catch (error) {
            console.error("Error in PlotService.getAllPlots:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    // Get plot by ID with full details
    async getPlotById(id: number): Promise<ServiceResponse<Plot>> {
        try {
            const include = [
                {
                    model: Caretaker,
                    as: "caretaker",
                    attributes: ["id", "name", "contact_info"]
                },
                {
                    model: Crop,
                    as: "current_crop",
                    attributes: ["id", "name", "planting_date", "harvest_date", "expected_yield"]
                }
            ];

            const plot = await Plot.findByPk(id, {
                include
            });
            
            if (!plot) {
                return {
                    success: false,
                    message: 'Plot not found'
                };
            }

            return {
                success: true,
                data: plot
            };
        } catch (error) {
            console.error("Error in PlotService.getPlotById:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    // Create new plot with validation
    async createPlot(plotData: {
        name: string;
        acreage: number;
        caretaker_id: number;
        current_crop_id: number;
        status: string;
    }): Promise<ServiceResponse<Plot>> {
        try {
            // Validate required fields
            if (!plotData.name || !plotData.acreage || !plotData.caretaker_id || !plotData.current_crop_id) {
                return {
                    success: false,
                    message: "Missing required fields: name, acreage, caretaker_id, current_crop_id"
                };
            }

            // Validate acreage is positive
            if (plotData.acreage <= 0) {
                return {
                    success: false,
                    message: "Acreage must be a positive number"
                };
            }

            const plot = await Plot.create(plotData);
            
            return {
                success: true,
                data: plot,
                message: 'Plot created successfully'
            };
        } catch (error) {
            console.error("Error in PlotService.createPlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    // Update plot
    async updatePlot(id: number, updateData: Partial<{
        name: string;
        acreage: number;
        caretaker_id: number;
        current_crop_id: number;
        status: string;
    }>): Promise<ServiceResponse<Plot>> {
        try {
            // Validate acreage if provided
            if (updateData.acreage !== undefined && updateData.acreage <= 0) {
                return {
                    success: false,
                    message: "Acreage must be a positive number"
                };
            }

            const [affectedCount] = await Plot.update(updateData, {
                where: { id }
            });

            if (affectedCount === 0) {
                return {
                    success: false,
                    message: 'Plot not found'
                };
            }

            // Fetch the updated plot with associations
            const updatedPlot = await this.getPlotById(id);
            return {
                success: true,
                data: updatedPlot.data,
                message: 'Plot updated successfully'
            };
        } catch (error) {
            console.error("Error in PlotService.updatePlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    // Delete plot
    async deletePlot(id: number): Promise<ServiceResponse<boolean>> {
        try {
            const affectedCount = await Plot.destroy({
                where: { id }
            });

            if (affectedCount === 0) {
                return {
                    success: false,
                    message: 'Plot not found'
                };
            }

            return {
                success: true,
                data: true,
                message: 'Plot deleted successfully'
            };
        } catch (error) {
            console.error("Error in PlotService.deletePlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    // Get plots by status
    async getPlotsByStatus(status: string, pagination?: PaginationOptions): Promise<ServiceResponse<{ items: Plot[]; total: number }>> {
        return this.getAllPlots(pagination, { status });
    }

    // Get plots by caretaker
    async getPlotsByCaretaker(caretakerId: number, pagination?: PaginationOptions): Promise<ServiceResponse<{ items: Plot[]; total: number }>> {
        return this.getAllPlots(pagination, { caretaker_id: caretakerId });
    }
}

export default new PlotService();

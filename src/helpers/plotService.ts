import { Plot, Caretaker, Crop } from "../models";
import { ServiceResponse, PaginationOptions } from "./index";


class PlotService {
    
    // Get all plots with pagination and filtering
    async getAllPlots(
        userId?: number,
        userRole?: string,
        pagination?: PaginationOptions,
        filters?: {
            status?: string;
            caretaker_id?: number;
            current_crop_id?: number;
        }
    ): Promise<ServiceResponse<{ items: Plot[]; total: number }>> {
        try {
            const where: any = {};
            
            // Only add user filtering if the user_id column exists in the database
            // This handles the case where the column hasn't been added yet
            if (userRole !== 'admin' && userId) {
                try {
                    // Check if user_id column exists by trying to use it in a query
                    await Plot.findOne({ where: { user_id: userId }, limit: 1 });
                    where.user_id = userId;
                } catch (error) {
                    // If column doesn't exist, don't filter by user_id
                    console.log('user_id column not found, skipping user filtering');
                }
            }
            
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
    async getPlotById(id: number, userId?: number, userRole?: string): Promise<ServiceResponse<Plot>> {
        try {
            const where: any = { id };
            
            // Add user filtering for non-admin users (only if column exists)
            if (userRole !== 'admin' && userId) {
                try {
                    await Plot.findOne({ where: { user_id: userId }, limit: 1 });
                    where.user_id = userId;
                } catch (error) {
                    // If column doesn't exist, don't filter by user_id
                    console.log('user_id column not found, skipping user filtering for getPlotById');
                }
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
                    attributes: ["id", "name", "variety", "description"]
                }
            ];

            const plot = await Plot.findOne({
                where,
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
        user_id?: number; // Made optional to handle database migration
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

            // Check if user_id column exists before trying to use it
            let finalPlotData = { ...plotData };
            if (plotData.user_id) {
                try {
                    // Test if we can query with user_id
                    await Plot.findOne({ where: { user_id: plotData.user_id }, limit: 1 });
                    finalPlotData = plotData; // Include user_id if column exists
                } catch (error) {
                    // Remove user_id if column doesn't exist
                    const { user_id, ...dataWithoutUserId } = plotData;
                    finalPlotData = dataWithoutUserId;
                    console.log('user_id column not found, creating plot without user_id');
                }
            }

            const plot = await Plot.create(finalPlotData);
            
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
        user_id?: number;
    }>): Promise<ServiceResponse<Plot>> {
        try {
            // Validate acreage if provided
            if (updateData.acreage !== undefined && updateData.acreage <= 0) {
                return {
                    success: false,
                    message: "Acreage must be a positive number"
                };
            }

            // Check if user_id column exists before trying to use it in where clause
            let whereClause: any = { id };
            if (updateData.user_id) {
                try {
                    await Plot.findOne({ where: { user_id: updateData.user_id }, limit: 1 });
                    whereClause.user_id = updateData.user_id;
                } catch (error) {
                    // Remove user_id from where clause if column doesn't exist
                    console.log('user_id column not found, not using user filtering for update');
                }
            }

            const [affectedCount] = await Plot.update(updateData, {
                where: whereClause
            });

            if (affectedCount === 0) {
                return {
                    success: false,
                    message: 'Plot not found or unauthorized'
                };
            }

            // Fetch the updated plot with associations and user filtering
            const updatedPlot = await this.getPlotById(id, updateData.user_id, 'admin'); // Use admin role to bypass user filtering for the fetch
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
    async deletePlot(id: number, userId?: number, userRole?: string): Promise<ServiceResponse<boolean>> {
        try {
            const where: any = { id };
            
            // Add user filtering for non-admin users (only if column exists)
            if (userRole !== 'admin' && userId) {
                try {
                    await Plot.findOne({ where: { user_id: userId }, limit: 1 });
                    where.user_id = userId;
                } catch (error) {
                    // If column doesn't exist, don't filter by user_id
                    console.log('user_id column not found, skipping user filtering for delete');
                }
            }

            const affectedCount = await Plot.destroy({
                where
            });

            if (affectedCount === 0) {
                return {
                    success: false,
                    message: 'Plot not found or unauthorized'
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
        return this.getAllPlots(undefined, undefined, pagination, { status });
    }

    // Get plots by caretaker
    async getPlotsByCaretaker(caretakerId: number, pagination?: PaginationOptions): Promise<ServiceResponse<{ items: Plot[]; total: number }>> {
        return this.getAllPlots(undefined, undefined, pagination, { caretaker_id: caretakerId });
    }
}

export default new PlotService();

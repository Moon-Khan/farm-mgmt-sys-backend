import { BaseController, HTTP_STATUS, PaginationParams } from "./basecontroller";
import PlotService from "../helpers/plotService";
import { Request, Response } from "express";

class PlotController extends BaseController {
    
    // Get all plots with pagination and filtering
    async getAllPlots(req: Request, res: Response): Promise<void> {
        try {


            console.log("===================> Fetching plots...");
            const pagination: any = this.getPaginationParams(req);
            const filters = {
                status: req.query.status as string,
                caretaker_name: req.query.caretaker_name as string, // Changed from caretaker_id to caretaker_name
                current_crop_id: req.query.current_crop_id ? parseInt(req.query.current_crop_id as string) : undefined
            };

            // Add user context
            const userId = req.user?.id;
            const userRole = req.user?.role;

            const result = await PlotService.getAllPlots(userId, userRole, pagination, filters);

            if (result.success && result.data) {
                const meta = this.calculatePaginationMeta(
                    pagination.page,
                    pagination.limit,
                    result.data.total
                );

                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data.items,
                    "Plots retrieved successfully",
                    meta
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve plots"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plots");
        }
    }

    // Get plot by ID
    async getPlotById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                this.error(req, res, this.status.BAD_REQUEST, "Invalid plot ID");
                return;
            }

            // Add user context
            const userId = req.user?.id;
            const userRole = req.user?.role;

            const result = await PlotService.getPlotById(id, userId, userRole);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Plot retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.NOT_FOUND,
                    result.message || "Plot not found"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plot");
        }
    }

    // Create a new plot
    async createPlot(req: Request, res: Response): Promise<void> {
        try {
            const plotData = {
                name: req.body.name,
                acreage: req.body.acreage,
                caretaker_name: req.body.caretaker_name,
                current_crop_id: req.body.current_crop_id,
                status: req.body.status,
                planted_date: req.body.planted_date,
                expected_harvest_date: req.body.expected_harvest_date,
                seed_variety: req.body.seed_variety,
                seed_quantity: req.body.seed_quantity,
                user_id: req.user?.id // Add user ID from auth
            };

            const result = await PlotService.createPlot(plotData);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Plot created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create plot"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create plot");
        }
    }

    // Update an existing plot
    async updatePlot(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = {
                name: req.body.name,
                acreage: req.body.acreage,
                caretaker_name: req.body.caretaker_name,
                current_crop_id: req.body.current_crop_id,
                status: req.body.status,
                planted_date: req.body.planted_date,
                expected_harvest_date: req.body.expected_harvest_date,
                seed_variety: req.body.seed_variety,
                seed_quantity: req.body.seed_quantity
            };

            const result = await PlotService.updatePlot(Number(id), updateData);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Plot updated successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    result.message?.includes('not found') ? this.status.NOT_FOUND : this.status.BAD_REQUEST,
                    result.message || "Failed to update plot"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to update plot");
        }
    }

    // Delete plot
    async deletePlot(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                this.error(req, res, this.status.BAD_REQUEST, "Invalid plot ID");
                return;
            }

            // Add user context
            const userId = req.user?.id;
            const userRole = req.user?.role;

            const result = await PlotService.deletePlot(id, userId, userRole);

            if (result.success) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    null,
                    result.message || "Plot deleted successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    result.message?.includes("not found") ? this.status.NOT_FOUND : this.status.BAD_REQUEST,
                    result.message || "Failed to delete plot"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to delete plot");
        }
    }

    // Get plots by status
    async getPlotsByStatus(req: Request, res: Response): Promise<void> {
        try {
            const status = req.params.status;
            const pagination: any = this.getPaginationParams(req);

            const result = await PlotService.getPlotsByStatus(status, pagination);

            if (result.success && result.data) {
                const meta = this.calculatePaginationMeta(
                    pagination.page,
                    pagination.limit,
                    result.data.total
                );

                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data.items,
                    `Plots with status '${status}' retrieved successfully`,
                    meta
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve plots by status"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plots by status");
        }
    }
}

export default new PlotController();

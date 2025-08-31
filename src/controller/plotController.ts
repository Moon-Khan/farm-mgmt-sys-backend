import { BaseController, HTTP_STATUS, PaginationParams } from "./basecontrotller";
import PlotService from "../helpers/plotService";
import { Request, Response } from "express";

class PlotController extends BaseController {
    
    // Get all plots with pagination and filtering
    async getAllPlots(req: Request, res: Response): Promise<void> {
        try {
            const pagination: any = this.getPaginationParams(req);
            const filters = {
                status: req.query.status as string,
                caretaker_id: req.query.caretaker_id ? parseInt(req.query.caretaker_id as string) : undefined,
                current_crop_id: req.query.current_crop_id ? parseInt(req.query.current_crop_id as string) : undefined
            };

            const result = await PlotService.getAllPlots(pagination, filters);

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

            const result = await PlotService.getPlotById(id);

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

    // Create new plot
    async createPlot(req: Request, res: Response): Promise<void> {
        try {
            const result = await PlotService.createPlot(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    result.message || "Plot created successfully"
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

    // Update plot
    async updatePlot(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                this.error(req, res, this.status.BAD_REQUEST, "Invalid plot ID");
                return;
            }

            const result = await PlotService.updatePlot(id, req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    result.message || "Plot updated successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    result.message?.includes("not found") ? this.status.NOT_FOUND : this.status.BAD_REQUEST,
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

            const result = await PlotService.deletePlot(id);

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

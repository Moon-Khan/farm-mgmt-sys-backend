// controllers/ReminderController.ts
import { BaseController } from "./basecontrotller";
import ReminderService from "../helpers/reminderService";
import NotificationService from "../helpers/notificationService";
import { Request, Response } from "express";

class ReminderController extends BaseController {
    
    // Get all reminders
    async getAllReminders(req: Request, res: Response): Promise<void> {
        try {
            const result = await ReminderService.getAllReminders();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Reminders retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve reminders"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve reminders");
        }
    }

    // Get reminders by plot ID
    async getRemindersByPlot(req: Request, res: Response): Promise<void> {
        try {
            const { plotId } = req.params;
            const result = await ReminderService.getRemindersByPlot(Number(plotId));

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Plot reminders retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve plot reminders"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plot reminders");
        }
    }

    // Get upcoming reminders (next 7 days by default)
    async getUpcomingReminders(req: Request, res: Response): Promise<void> {
        try {
            const days = req.query.days ? Number(req.query.days) : 7;
            const result = await ReminderService.getUpcomingReminders(days);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Upcoming reminders retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve upcoming reminders"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve upcoming reminders");
        }
    }

    // Create new reminder
    async createReminder(req: Request, res: Response): Promise<void> {
        try {
            const result = await ReminderService.createReminder(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Reminder created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create reminder"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create reminder");
        }
    }

    // Mark reminder as done
    async markAsDone(req: Request, res: Response): Promise<void> {
        try {
            const { reminderId } = req.params;
            const result = await ReminderService.markAsDone(Number(reminderId));

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Reminder marked as done successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to mark reminder as done"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to mark reminder as done");
        }
    }

    // Generate weekly reminders
    async generateWeeklyReminders(req: Request, res: Response): Promise<void> {
        try {
            const result = await ReminderService.generateWeeklyReminders();

            if (result.success && result.data) {
                // Send emails for each created reminder (non-blocking best-effort)
                Promise.all(
                    result.data.map(r => NotificationService.sendReminderEmail(r).catch(err => {
                        console.error("Failed to send reminder email for", r?.id, err);
                    }))
                ).catch(() => {});
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Weekly reminders generated successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to generate weekly reminders"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to generate weekly reminders");
        }
    }
}

export default new ReminderController();

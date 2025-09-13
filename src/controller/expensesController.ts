// controllers/CropController.ts
import { BaseController } from "./basecontrotller";
import ExpenseService from "../helpers/expensesService";
import { Request, Response } from "express";

class ExpenseController extends BaseController {
    
    // Get all expenses
    async getAllExpenses(req: Request, res: Response): Promise<void> {
        try {
            const result = await ExpenseService.getAllExpenses();

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Expenses retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve expenses"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve expenses");
        }
    }

    // Create new expense record
    async createExpense(req: Request, res: Response): Promise<void> {
        try {
            const result = await ExpenseService.createExpense(req.body);

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.CREATED,
                    result.data,
                    "Expense record created successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to create expense record"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to create expense record");
        }
    }
}

export default new ExpenseController();


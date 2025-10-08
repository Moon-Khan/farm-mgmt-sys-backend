// controllers/expensesController.ts
import { BaseController } from "./basecontroller";
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

    // Get expenses by plot ID
    async getExpensesByPlot(req: Request, res: Response): Promise<void> {
        try {
            const { plotId } = req.params;
            const result = await ExpenseService.getExpensesByPlot(Number(plotId));

            if (result.success && result.data) {
                this.success(
                    req,
                    res,
                    this.status.OK,
                    result.data,
                    "Plot expenses retrieved successfully"
                );
            } else {
                this.error(
                    req,
                    res,
                    this.status.BAD_REQUEST,
                    result.message || "Failed to retrieve plot expenses"
                );
            }
        } catch (error) {
            this.handleServiceError(req, res, error, "Failed to retrieve plot expenses");
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


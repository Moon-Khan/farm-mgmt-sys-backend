// helpers/cropService.ts
import { Expense } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class ExpenseService {
    async getAllExpenses(): Promise<ServiceResponse<Expense[]>> {
        try {
            const expense = await Expense.findAll({
            });

            return {
                success: true,
                data: expense
            };
        } catch (error) {
            console.error("Error in ExpenseService.getAllExpenses:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async getExpensesByPlot(plotId: number): Promise<ServiceResponse<Expense[]>> {
        try {
            const expenses = await Expense.findAll({
                where: {
                    plot_id: plotId
                }
            });

            return {
                success: true,
                data: expenses
            };
        } catch (error) {
            console.error("Error in ExpenseService.getExpensesByPlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async createExpense(expenseData: any): Promise<ServiceResponse<Expense>> {
        try {
            const expense = await Expense.create(expenseData);

            return {
                success: true,
                data: expense
            };
        } catch (error) {
            console.error("Error in ExpenseService.createExpense:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new ExpenseService();

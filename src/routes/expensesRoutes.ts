import express from 'express';
import getAllExpenses from "../controller/expensesController";

const expenses = express.Router();

expenses.get("/", (req, res) => getAllExpenses.getAllExpenses(req, res));
expenses.post("/", (req, res) => getAllExpenses.createExpense(req, res));

export default expenses;

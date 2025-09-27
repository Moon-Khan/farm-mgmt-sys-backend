import express from 'express';
import reminderController from '../controller/reminderController';
import { cronAuth } from '../middleware/cronAuth';
import { auth } from '../middleware/auth';

const reminders = express.Router();

// Get all reminders
reminders.get("/", auth, (req, res) => reminderController.getAllReminders(req, res));

// Get reminders by plot ID
reminders.get("/plot/:plotId", auth, (req, res) => reminderController.getRemindersByPlot(req, res));

// Get upcoming reminders (next 7 days by default)
reminders.get("/upcoming", auth, (req, res) => reminderController.getUpcomingReminders(req, res));

// Create new reminder
reminders.post("/", auth, (req, res) => reminderController.createReminder(req, res));

// Mark reminder as done
reminders.patch("/:reminderId/done", auth, (req, res) => reminderController.markAsDone(req, res));

// Generate weekly reminders (protected for scheduler)
reminders.post("/generate-weekly", cronAuth, (req, res) => reminderController.generateWeeklyReminders(req, res));

export default reminders;

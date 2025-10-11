import { Reminder } from "../models"; // adjust import based on your structure
import { Op } from "sequelize";
import { ServiceResponse } from "./index";

interface ReminderData {
  plot_id: number;
  crop_id: number;
  type: 'watering' | 'fertilizer' | 'spray' | 'harvest';
  due_date: Date;
  method:'Email';
}

class ReminderService {
    async getAllReminders(type?: 'watering' | 'fertilizer' | 'spray' | 'harvest'): Promise<ServiceResponse<Reminder[]>> {
        try {
            const reminders = await Reminder.findAll({
                where: type ? { type } : undefined,
                order: [['due_date', 'ASC']]
            });

            return {
                success: true,
                data: reminders
            };
        } catch (error) {
            console.error("Error in ReminderService.getAllReminders:", error);
            return {    
                success: false,
                errors: [error]
            };
        }
    }

    async getRemindersByPlot(plotId: number): Promise<ServiceResponse<Reminder[]>> {
        try {
            const reminders = await Reminder.findAll({
                where: {
                    plot_id: plotId
                },
                order: [['due_date', 'ASC']]
            });

            return {
                success: true,
                data: reminders
            };
        } catch (error) {
            console.error("Error in ReminderService.getRemindersByPlot:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async getUpcomingReminders(days: number = 7, type?: 'watering' | 'fertilizer' | 'spray' | 'harvest'): Promise<ServiceResponse<Reminder[]>> {
        try {
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + days);

            const reminders = await Reminder.findAll({
                where: {
                    due_date: {
                        [Op.gte]: today,
                        [Op.lte]: futureDate
                    },
                    sent: false,
                    ...(type ? { type } : {})
                },
                order: [["due_date", "ASC"]]
            });

            return {
                success: true,
                data: reminders
            };
        } catch (error) {
            console.error("Error in ReminderService.getUpcomingReminders:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async createReminder(reminderData: ReminderData): Promise<ServiceResponse<Reminder>> {
        try {
            const reminder = await Reminder.create(reminderData);

            return {
                success: true,
                data: reminder
            };
        } catch (error) {
            console.error("Error in ReminderService.createReminder:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async markReminderAsDone(reminderId: number): Promise<ServiceResponse<Reminder>> {
        try {
            const reminder = await Reminder.findByPk(reminderId);
            if (!reminder) {
                return {
                    success: false,
                    errors: [new Error('Reminder not found')]
                };
            }

            reminder.sent = true;
            await reminder.save();

            return {
                success: true,
                data: reminder
            };
        } catch (error) {
            console.error("Error in ReminderService.markReminderAsDone:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }

    async generateWeeklyReminders(): Promise<ServiceResponse<Reminder[]>> {
        try {
            const createdReminders: Reminder[] = [];

            // Get all active plots with crops
            const { Plot, Crop } = await import('../models');
            const activePlots = await Plot.findAll({
                where: {
                    status: { [Op.in]: ['growing', 'planting'] },
                    current_crop_id: { [Op.not]: null }
                }
            });

            for (const plot of activePlots) {
                const cropId = (plot as any).current_crop_id;
                if (!cropId) continue;

                const crop = await Crop.findByPk(cropId);
                if (!crop) continue;

                // Create simple weekly reminders for next 7 days
                const nextWeekDate = new Date();
                nextWeekDate.setDate(nextWeekDate.getDate() + 7);

                // Create one reminder per activity type for the coming week
                const activities = ['watering', 'fertilizer', 'spray'] as const;

                for (const activity of activities) {
                    const existingReminder = await Reminder.findOne({
                        where: {
                            plot_id: plot.id,
                            crop_id: cropId,
                            type: activity,
                            due_date: {
                                [Op.gte]: new Date(),
                                [Op.lte]: nextWeekDate
                            }
                        }
                    });

                    if (!existingReminder) {
                        const reminder = await Reminder.create({
                            plot_id: plot.id,
                            crop_id: cropId,
                            type: activity,
                            due_date: nextWeekDate,
                            method: 'Email',
                            sent: false
                        });
                        createdReminders.push(reminder);
                    }
                }
            }

            return {
                success: true,
                data: createdReminders
            };
        } catch (error) {
            console.error("Error in ReminderService.generateWeeklyReminders:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new ReminderService();

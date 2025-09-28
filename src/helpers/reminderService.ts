import { Reminder } from "../models"; // adjust import based on your structure
import { Op } from "sequelize";
import { ServiceResponse } from "./index";

interface ReminderData {
  plot_id: number;
  crop_id: number;
  type: 'watering' | 'fertilizer' | 'spray' | 'harvest';
  due_date: Date;
  method: 'SMS' | 'Email' | 'WhatsApp';
}

class ReminderService {
    async getAllReminders(): Promise<ServiceResponse<Reminder[]>> {
        try {
            const reminders = await Reminder.findAll({
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

    async getUpcomingReminders(days: number = 7): Promise<ServiceResponse<Reminder[]>> {
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
                    sent: false
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

    async markAsDone(reminderId: number): Promise<ServiceResponse<Reminder>> {
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
            console.error("Error in ReminderService.markAsDone:", error);
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
                    // DB stores status values as 'Active', 'Fallow', 'harvested'
                    // Generate reminders only for actively cultivated plots
                    status: 'Active'
                },
                include: [{
                    model: Crop,
                    as: 'current_crop'
                }]
            });

            for (const plot of activePlots) {
                // Be resilient to alias casing differences ('current_crop' vs 'currentCrop')
                const currentCrop = (plot as any).current_crop || (plot as any).currentCrop;
                if (!currentCrop) continue;

                // Generate reminders based on crop type and typical schedule
                const reminders = this.generateCropReminders(plot.id, currentCrop.id, currentCrop.name);
                
                for (const reminderData of reminders) {
                    const existingReminder = await Reminder.findOne({
                        where: {
                            plot_id: reminderData.plot_id,
                            crop_id: reminderData.crop_id,
                            type: reminderData.type,
                            due_date: reminderData.due_date
                        }
                    });

                    if (!existingReminder) {
                        const reminder = await Reminder.create(reminderData);
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

    private generateCropReminders(plotId: number, cropId: number, cropName: string): ReminderData[] {
        const reminders: ReminderData[] = [];
        const today = new Date();
        
        // Generate reminders for the next week
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Watering reminders (every 2-3 days for most crops)
            if (i % 2 === 0) {
                reminders.push({
                    plot_id: plotId,
                    crop_id: cropId,
                    type: 'watering',
                    due_date: date,
                    method: 'Email'
                });
            }

            // Fertilizer reminders (weekly)
            if (i === 3) {
                reminders.push({
                    plot_id: plotId,
                    crop_id: cropId,
                    type: 'fertilizer',
                    due_date: date,
                    method: 'Email'
                });
            }

            // Spray/pesticide reminders (weekly)
            if (i === 5) {
                reminders.push({
                    plot_id: plotId,
                    crop_id: cropId,
                    type: 'spray',
                    due_date: date,
                    method: 'Email'
                });
            }

            // Harvest reminders (for crops near harvest time)
            if (cropName.toLowerCase().includes('tomato') && i === 7) {
                reminders.push({
                    plot_id: plotId,
                    crop_id: cropId,
                    type: 'harvest',
                    due_date: date,
                    method: 'Email'
                });
            }
        }

        return reminders;
    }
}

export default new ReminderService();

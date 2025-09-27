import cron from "node-cron";
import ReminderService from "../helpers/reminderService";
import NotificationService from "../helpers/notificationService";

// Runs every Wednesday at 09:00 server time
// Cron format: min hour day-of-month month day-of-week
// day-of-week: 0 (Sun) - 6 (Sat), Wednesday = 3
const SCHEDULE = process.env.REMINDER_CRON || "0 9 * * 3";

export function initReminderCron() {
  console.log(`[Cron] Scheduling weekly reminders job with pattern: ${SCHEDULE}`);

  cron.schedule(SCHEDULE, async () => {
    console.log("[Cron] Running weekly reminder generation...");
    try {
      const result = await ReminderService.generateWeeklyReminders();
      if (result.success && Array.isArray(result.data)) {
        console.log(`[Cron] Generated ${result.data.length} reminders.`);
        // Send an email for each created reminder (stubbed)
        for (const r of result.data) {
          try {
            await NotificationService.sendReminderEmail(r);
          } catch (e) {
            console.error("[Cron] Failed to send email for reminder", r?.id, e);
          }
        }
      } else {
        console.warn("[Cron] No reminders generated or service returned an error.", result?.errors || result?.message);
      }
    } catch (err) {
      console.error("[Cron] Weekly reminder generation failed:", err);
    }
  });
}

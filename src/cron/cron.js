import cron from "node-cron";

// Initialize cron jobs
import { initReminderCron } from "./remindersCron.js";
import { initIrrigationCron } from "./irrigationCron.js";

// Initialize all cron jobs
console.log("[Cron] Initializing cron jobs...");
initReminderCron();
initIrrigationCron();

cron.schedule("*/10 * * * *", () => {
  console.log("Running cron job every 10 minutes");
});

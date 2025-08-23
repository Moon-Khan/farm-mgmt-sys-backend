import cron from "node-cron";

cron.schedule("*/10 * * * *", () => {
  console.log("Running cron job every 10 minutes");
});

import { Request, Response, NextFunction } from "express";

// Protects scheduler-only endpoints using a shared secret header
// Usage: set REMINDER_CRON_TOKEN in your environment, and configure the
// AWS EventBridge Scheduler API Destination to send header X-CRON-TOKEN with the same value.
export function cronAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.REMINDER_CRON_TOKEN;
  if (!expected) {
    console.warn("[cronAuth] REMINDER_CRON_TOKEN not set. Skipping protection.");
    return next();
  }
  const token = req.header("X-CRON-TOKEN");
  if (!token || token !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return next();
}

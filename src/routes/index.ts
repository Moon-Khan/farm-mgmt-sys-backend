import { Application, Request, Response } from "express";

export default function initializeRoutes(app: Application) {
  // Basic hello route
  app.get("/v1/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello from Backend with Sequelize!" });
  });

  // Cron test route
  app.get("/v1/cron", (req: Request, res: Response) => {
    console.log("⏰ Cron job triggered at", new Date().toISOString());
    res.json({
      success: true,
      message: "Cron job executed",
      time: new Date().toISOString(),
    });
  });
}

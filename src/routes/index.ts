import { Application, Request, Response } from "express";
import Plot from "../models/plot";


export default function initializeRoutes(app: Application) {
  // Get all plots
  app.get("/v1/plots", async (req: Request, res: Response) => {
    try {
      const plots = await Plot.findAll();
      res.json({ plots });
    } catch (err: any) {
      res.status(500).json({ message: "Error fetching plots", error: err.message });
    }
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

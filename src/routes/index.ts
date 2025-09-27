import { Application, Request, Response } from "express";
import plots from "./plotRoutes";
import crops from "./cropRoutes";
import caretakers from "./caretakersRoutes";
import fertilizers from "./fertilizerRoutes";
import pesticides from "./pesticideRoutes";
import irrigations from "./irrigationRoutes";
import lifecyclecrops from "./lifecycleRoutes";
import expenses from "./expensesRoutes";
import reports from "./reportsRoutes";
import reminders from "./reminderRoutes";
import auth from "./authRoutes";
import { auth as requireAuth } from "../middleware/auth";
import weather from "./weatherRoutes";


const initializeRoutes = (app: Application) => {

  // Public auth endpoints
  app.use("/v1/auth", auth)
  app.use("/v1/weather", weather)

  // Protected API endpoints
  app.use("/v1/plots", requireAuth, plots)
  app.use("/v1/crops", requireAuth, crops)
  app.use("/v1/caretakers", requireAuth, caretakers)
  app.use("/v1/fertilizers", requireAuth, fertilizers)
  app.use("/v1/pesticides", requireAuth, pesticides)
  app.use("/v1/irrigation", requireAuth, irrigations)
  app.use("/v1/lifecyclecrops", requireAuth, lifecyclecrops)
  app.use("/v1/expenses", requireAuth, expenses)
  app.use("/v1/reports", requireAuth, reports)
  app.use("/v1/reminders", reminders)

  

}

export default initializeRoutes;
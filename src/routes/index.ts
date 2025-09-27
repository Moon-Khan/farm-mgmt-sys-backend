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


const initializeRoutes = (app: Application) => {

  app.use("/v1/plots", plots)
  app.use("/v1/crops", crops)
  app.use("/v1/caretakers", caretakers)
  app.use("/v1/fertilizers", fertilizers )
  app.use("/v1/pesticides", pesticides )
  app.use("/v1/irrigation", irrigations )
  app.use("/v1/lifecyclecrops", lifecyclecrops )
  app.use("/v1/expenses", expenses )
  app.use("/v1/reports", reports )
  app.use("/v1/reminders", reminders )
  app.use("/v1/auth", auth )

  

}

export default initializeRoutes;
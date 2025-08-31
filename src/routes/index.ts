import { Application, Request, Response } from "express";
import plots from "./plotRoutes";
import crops from "./cropRoutes";
import caretakers from "./caretakersRoutes";


const initializeRoutes = (app: Application) => {

  app.use("/v1/plots", plots)
  app.use("/v1/crops", crops)
  app.use("/v1/caretakers", caretakers)

  

}

export default initializeRoutes;
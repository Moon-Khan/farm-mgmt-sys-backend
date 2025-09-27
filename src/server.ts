import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/sequelize";   // Sequelize instance
import initializeRoutes from "./routes/index";      // Central route loader

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize routes
initializeRoutes(app);


// Database Sync + Server Start
sequelize
  .sync({ alter: true }) // auto-create/update tables from models
  .then(() => {
    console.log("✅ Database synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err);
  });

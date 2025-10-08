import Plot from "./plot";
import Caretaker from "./caretaker";
import Crop from "./crop";
import CropLifecycle from "./cropLifecycle";
import Fertilizer from "./fertilizer";
import Pesticide from "./pesticide";
import Irrigation from "./irrigation";
import Expense from "./expense";
import Reminder from "./Reminder";
import User from "./user";

// Plot Associations
// Plot.belongsTo(Caretaker, { foreignKey: "caretaker_id", as: "caretaker" }); // Removed - caretaker_id now stores name directly
Plot.belongsTo(Crop, { foreignKey: "current_crop_id", as: "current_crop" });

// User Associations (temporarily disabled)
// Plot.belongsTo(User, { foreignKey: "user_id", as: "owner" }); // Temporarily disabled
// User.hasMany(Plot, { foreignKey: "user_id", as: "plots" }); // Temporarily disabled

// Reverse associations
// Caretaker.hasMany(Plot, { foreignKey: "caretaker_id", as: "plots" }); // Removed - caretaker_id now stores name directly
Crop.hasMany(Plot, { foreignKey: "current_crop_id", as: "current_plots" });

// CropLifecycle Associations
CropLifecycle.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
CropLifecycle.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(CropLifecycle, { foreignKey: "plot_id", as: "croplifecycles" });
Crop.hasMany(CropLifecycle, { foreignKey: "crop_id", as: "lifecycles" });

// Fertilizer Associations
Fertilizer.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
Fertilizer.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(Fertilizer, { foreignKey: "plot_id", as: "fertilizers" });
Crop.hasMany(Fertilizer, { foreignKey: "crop_id", as: "fertilizers" });

// Pesticide Associations
Pesticide.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
Pesticide.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(Pesticide, { foreignKey: "plot_id", as: "pesticides" });
Crop.hasMany(Pesticide, { foreignKey: "crop_id", as: "pesticides" });

// Irrigation Associations
Irrigation.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
Irrigation.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(Irrigation, { foreignKey: "plot_id", as: "irrigations" });
Crop.hasMany(Irrigation, { foreignKey: "crop_id", as: "irrigations" });

// Expense Associations
Expense.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
Expense.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(Expense, { foreignKey: "plot_id", as: "expenses" });
Crop.hasMany(Expense, { foreignKey: "crop_id", as: "expenses" });

// Reminder Associations
Reminder.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });
Reminder.belongsTo(Crop, { foreignKey: "crop_id", as: "crop" });
Plot.hasMany(Reminder, { foreignKey: "plot_id", as: "reminders" });
Crop.hasMany(Reminder, { foreignKey: "crop_id", as: "reminders" });

export { 
  Plot, 
  Caretaker, 
  Crop, 
  CropLifecycle, 
  Fertilizer, 
  Pesticide, 
  Irrigation,
  Expense,
  Reminder,
  User
};

import Plot from "./plot";
import Caretaker from "./caretaker";
import Crop from "./crop";

// Associations
Plot.belongsTo(Caretaker, { foreignKey: "caretaker_id", as: "caretaker" });
Plot.belongsTo(Crop, { foreignKey: "current_crop_id", as: "current_crop" });

// If you also want history of crops per plot
Plot.hasMany(Crop, { foreignKey: "plot_id", as: "crops" });
Crop.belongsTo(Plot, { foreignKey: "plot_id", as: "plot" });

export { Plot, Caretaker, Crop };

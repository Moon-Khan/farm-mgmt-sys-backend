import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Plot from "./plot";

class Crop extends Model {
  public id!: number;
  public name!: string;
  public sowing_date!: Date;
  public harvest_date!: Date;
  public plot_id!: number;
}

Crop.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sowing_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    harvest_date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "Crops",
    timestamps: true,
  }
);

// ✅ Associations
Plot.hasMany(Crop, { foreignKey: "plot_id" });
Crop.belongsTo(Plot, { foreignKey: "plot_id" });

export default Crop;

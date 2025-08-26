import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import Plot from "./plot";

class Crop extends Model {
  public id!: number;
  public name!: string;
  public variety!: string;
  public description!: string;
  public sowing_date!: Date;
  public harvest_date!: Date;
  public plot_id!: number;
}

Crop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "crops",
    timestamps: true,
  }
);

// ✅ Associations
Plot.hasMany(Crop, { foreignKey: "plot_id" });
Crop.belongsTo(Plot, { foreignKey: "plot_id" });

export default Crop;
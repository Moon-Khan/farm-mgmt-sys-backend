import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Plot extends Model {
  public id!: number;
  public name!: string;
  public size_acres!: number;
  public caretaker!: string;
}

Plot.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size_acres: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    caretaker: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "Plots",
    timestamps: true,
  }
);

export default Plot;

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Crop extends Model {
  public id!: number;
  public name!: string;
  public variety!: string;
  public description!: string;
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
  },
  {
    sequelize,
    tableName: "crops",
    timestamps: true,
  }
);

export default Crop;
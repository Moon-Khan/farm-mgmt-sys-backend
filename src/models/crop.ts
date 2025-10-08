import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Crop extends Model {
  public id!: number;
  public name!: string;
  public nameUrdu!: string;

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
    name_urdu: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    sequelize,
    tableName: "crops",
    timestamps: true,
  }
);

export default Crop;
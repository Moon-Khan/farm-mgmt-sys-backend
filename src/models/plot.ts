import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Plot extends Model {
  public id!: number;
  public name!: string;
  public acreage!: number;
  public caretaker_id!: number;
  public current_crop_id!: number;
  public status !: number;
}


Plot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acreage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    caretaker_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "caretakers",
        key: "id",
      }
    },

    current_crop_id: {
      type: DataTypes.INTEGER,
      references:{
        model: "crops",
        key: "id"
      }
    },

    status:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "plots",
    timestamps: true,
  }
);

export default Plot;

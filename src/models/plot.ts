import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./user";

class Plot extends Model {
  public id!: number;
  public name!: string;
  public acreage!: number;
  public caretaker_id!: number;
  public current_crop_id!: number;
  public user_id!: number; // Add this field
  public status!: string;

  // Relationship properties
  public current_crop?: any;
  public croplifecycles?: any[];
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Temporarily allow null for existing data
      references: {
        model: "users",
        key: "id",
      }
    },
  },
  {
    sequelize,
    tableName: "plots",
    timestamps: true,
  }
);

Plot.belongsTo(User, {
  foreignKey: "user_id",
  as: "owner"
});

export default Plot;

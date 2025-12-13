import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import User from "./user";

class Plot extends Model {
  public id!: number;
  public name!: string;
  public acreage!: number;
  public caretaker_name!: string; // Changed to string to store caretaker name directly
  public current_crop_id!: number;
  public user_id!: number; // Add this field
  public status!: string;
  public planted_date?: Date;
  public expected_harvest_date?: Date;
  public is_active!: boolean; // Soft delete field
  public seed_variety?: string;
  public seed_quantity?: number;

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
    caretaker_name: {
      type: DataTypes.STRING, // Changed to STRING to store caretaker name directly
      allowNull: false,
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
    planted_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expected_harvest_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seed_variety: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seed_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Temporarily allow null for existing data
      references: {
        model: "users",
        key: "id",
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Default to active
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

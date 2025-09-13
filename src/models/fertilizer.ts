import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Fertilizer extends Model {
  public id!: number;
  public plot_id!: number;
  public crop_id!: number;
  public date!: Date;
  public fertilizer_type!: string;
  public quantity!: number;
  public cost!: number;
}

Fertilizer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fertilizer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "fertilizer",
    timestamps: true,
  }
);

export default Fertilizer;

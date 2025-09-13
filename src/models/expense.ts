import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Expense extends Model {
  public id!: number;
  public plot_id!: number;
  public crop_id!: number;
  public type!: string;
  public amount!: number;
  public date!: Date;
  public description!: string;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "plots",
        key: "id",
      }
    },
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "crops",
        key: "id",
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },  
  },
  {
    sequelize,
    tableName: "expenses",
    timestamps: true,
  }
);

export default Expense;
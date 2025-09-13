import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Pesticide extends Model {
  public id!: number;
  public plot_id!: number;
  public crop_id!: number;
  public date!: Date;
  public pesticide_type!: string;
  public quantity!: number;
  public cost!: number;
}

Pesticide.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pesticide_type: {
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
    tableName: "pesticide",
    timestamps: true,
  }
);

export default Pesticide;

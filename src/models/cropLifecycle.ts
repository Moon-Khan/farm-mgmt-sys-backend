import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class CropLifecycle extends Model {
  public id!: number;
  public plot_id!: number;
  public crop_id!: number;
  public event_type!: string;
  public title!: string;
  public description!: string;
  public date!: Date;
  public notes!: string;
  public yield_amount!: number;
  public yield_unit!: string;
}

CropLifecycle.init(
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
      allowNull: true,
      references: {
        model: "crops",
        key: "id",
      }
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    yield_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    yield_unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "croplifecycle",
    timestamps: true,
  }
);

export default CropLifecycle;

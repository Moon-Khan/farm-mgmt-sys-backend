import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

class Caretaker extends Model {
  public id!: number;
  public name!: string;
  public contact_info!: string;
}

Caretaker.init(
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
    contact_info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "caretakers",
    timestamps: true,
  }
);

export default Caretaker;
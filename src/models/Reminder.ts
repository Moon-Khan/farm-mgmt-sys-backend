import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface ReminderAttributes {
  id: number;
  plot_id: number;
  crop_id: number;
  type: 'watering' | 'fertilizer' | 'spray' | 'harvest';
  due_date: Date;
  sent: boolean;
  method: 'SMS' | 'Email' | 'WhatsApp';
  created_at?: Date;
  updated_at?: Date;
}

interface ReminderCreationAttributes extends Optional<ReminderAttributes, 'id' | 'sent'> {}

class Reminder extends Model<ReminderAttributes, ReminderCreationAttributes> implements ReminderAttributes {
  public id!: number;
  public plot_id!: number;
  public crop_id!: number;
  public type!: 'watering' | 'fertilizer' | 'spray' | 'harvest';
  public due_date!: Date;
  public sent!: boolean;
  public method!: 'SMS' | 'Email' | 'WhatsApp';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Reminder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Temporarily comment out references to avoid constraint issues
      // references: {
      //   model: 'plots',
      //   key: 'id',
      // },
    },
    crop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Temporarily comment out references to avoid constraint issues
      // references: {
      //   model: 'crops',
      //   key: 'id',
      // },
    },
    type: {
      type: DataTypes.ENUM('watering', 'fertilizer', 'spray', 'harvest'),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    method: {
      type: DataTypes.ENUM('SMS', 'Email', 'WhatsApp'),
      allowNull: false,
      defaultValue: 'Email',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Reminder',
    tableName: 'reminders',
    timestamps: true,
    underscored: true,
  }
);

export default Reminder;

import { Model, DataTypes } from 'sequelize'
import sequelize from './db.sequelize'
import { STATUS, PRIORITY } from '../constants';

export class Task extends Model { }
Task.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    title: {
      type: DataTypes.STRING(160),
      allowNull: false,
      field: 'title'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'description'
    },
    status: {
      type: DataTypes.ENUM,
      values: [STATUS.Open, STATUS.InProgress, STATUS.Completed],
      defaultValue: STATUS.Open,
      allowNull: false,
      field: 'status'
    },
    priority: {
      type: DataTypes.ENUM,
      values: [PRIORITY.Low, PRIORITY.Medium, PRIORITY.High], 
      defaultValue: PRIORITY.Low,
      field: 'status'
    },
    timeline: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
      field: 'timeline'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'deleted_at'
    }
  },
  { sequelize, paranoid: true, freezeTableName: true, modelName: 'tasks' }
);

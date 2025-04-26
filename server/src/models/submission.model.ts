import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user.model';
import Problem from './problem.model';

interface SubmissionAttributes {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error';
  runtime: number;
  memory: number;
  aiFeedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubmissionCreationAttributes extends Omit<SubmissionAttributes, 'id'> {}

class Submission extends Model<SubmissionAttributes, SubmissionCreationAttributes> implements SubmissionAttributes {
  public id!: string;
  public userId!: string;
  public problemId!: string;
  public language!: string;
  public code!: string;
  public status!: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error';
  public runtime!: number;
  public memory!: number;
  public aiFeedback?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    problemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'problems',
        key: 'id',
      },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error'),
      allowNull: false,
    },
    runtime: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    memory: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    aiFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Submission',
    tableName: 'submissions',
  }
);

// Associations
Submission.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Submission.belongsTo(Problem, { foreignKey: 'problemId', as: 'problem' });

export default Submission;
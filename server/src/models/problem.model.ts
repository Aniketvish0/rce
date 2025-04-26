import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface ProblemAttributes {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string[];
  starterCode: Record<string, string>;
  testCases: string[];
  solutions: Record<string, string>;
  constraints: string;
  hints: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProblemCreationAttributes extends Omit<ProblemAttributes, 'id'> {}

class Problem extends Model<ProblemAttributes, ProblemCreationAttributes> implements ProblemAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public difficulty!: 'easy' | 'medium' | 'hard';
  public category!: string[];
  public starterCode!: Record<string, string>;
  public testCases!: string[];
  public solutions!: Record<string, string>;
  public constraints!: string;
  public hints!: string[];
  public createdAt!: Date;
  public updatedAt!: Date;
}

Problem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    starterCode: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    testCases: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    solutions: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hints: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Problem',
    tableName: 'problems',
  }
);

export default Problem;
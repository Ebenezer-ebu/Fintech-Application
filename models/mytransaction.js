'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mytransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Mytransaction.init(
    {
      amount: DataTypes.DECIMAL,
      userId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      typeOfTransaction: DataTypes.ENUM("card", "bank transfer"),
    },
    {
      sequelize,
      modelName: "Mytransaction",
    }
  );
  return Mytransaction;
};
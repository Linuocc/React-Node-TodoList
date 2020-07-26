'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Todo.init({
    name: DataTypes.STRING,
    deadline: {
      type:DataTypes.DATE,
      get() {
        return moment(this.getDataValue('deadline')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    content: DataTypes.STRING,
    status: {
      type:DataTypes.INTEGER,
      defaultValue:1
    }
  }, {
    sequelize,
    modelName: 'Todo',
    timestamps:false
  });
  return Todo;
};
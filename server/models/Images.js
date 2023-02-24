const { INTEGER } = require("sequelize")
const { Packages } = require('../models')



module.exports = (sequelize, DataTypes) => {
    const Images = sequelize.define("Images", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      urlPath: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
    
  
    return Images;
};
const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        pwd: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })




    return Users
}
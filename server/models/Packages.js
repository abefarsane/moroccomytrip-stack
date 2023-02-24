const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Packages = sequelize.define("Packages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER(5),
            allowNull: false
        },
        people: {
            type: DataTypes.INTEGER(5),
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(5),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(2000),
            allowNull: false
        }
    })

    Packages.associate = (models) => {
        Packages.hasMany(models.Services, {
            onDelete: "cascade"
        }),Packages.hasMany(models.Images, {
            onDelete: "cascade"
        }),Packages.hasMany(models.Chat, {
            onDelete: "cascade"
        }),Packages.hasMany(models.Bookings)
    }


    

    return Packages
}
const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Services = sequelize.define("Services", {
        serviceBody: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        included: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

    return Services
}
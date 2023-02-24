const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Messages = sequelize.define("Messages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text_body: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    })


    Messages.associate = (models) => {
        Messages.belongsTo(models.Users)
    }

    return Messages
}
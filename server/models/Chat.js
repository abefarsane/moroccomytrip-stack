const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Chat = sequelize.define("Chat", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        toRead: {
            type: DataTypes.BOOLEAN,
            default: true
        }
    })

    
    Chat.associate = (models) => {
        Chat.belongsTo(models.Users, { as: "sender"})
        Chat.belongsTo(models.Users, { as: "receiver"})
        Chat.belongsTo(models.Packages)
        Chat.hasMany(models.Messages, {
            onDelete: "cascade"    
        })
    }



    return Chat
}
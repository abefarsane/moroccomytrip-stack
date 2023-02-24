const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Booking = sequelize.define("Bookings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        notes: {
            type: DataTypes.STRING(3000),
            allowNull: true
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dateFrom: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dateTo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING(20),
            default: "EURO"
        },
        status: {
            type: DataTypes.STRING(60),
            default: "PENDING_PAYMENT"
        }
    })

    
    Booking.associate = (models) => {
        Booking.belongsTo(models.Users, { as: "client"})
        Booking.belongsTo(models.Packages),
        Booking.belongsTo(models.Chat)
    }



    return Booking
}
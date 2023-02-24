const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Packages, Images, Sequelize, Users, Messages, Chat, Bookings, sequelize } = require('../models');
const e = require('express');


router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line


router.post('/add', validateToken, async (req, res) => {
    const { notes, dateFrom, dateTo, totalPrice, currency, clientId, packageId, chatId} = req.body
    
    const checkIfAlreadyBooked = await Bookings.findOne({
        where: { clientId: clientId, PackageId: packageId}
    })

    if (checkIfAlreadyBooked == null) {
        await Bookings.create({
            notes: notes,
            dateFrom: dateFrom,
            dateTo: dateTo,
            totalPrice: totalPrice,
            currency: currency,
            clientId: clientId, 
            PackageId: packageId,
            ChatId: chatId,
            status: "PENDING_PAYMENT"
        })

        res.json({
            status: true,
            message: "Booking sent succesfully! Pending client payment"
        })
    } else {
        res.json({
            status: false,
            message: "The booking has been already made."
        })
    }

})

router.get('/allBookings', validateToken, async (req, res) => {


    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        const allBookings = await Bookings.findAll({
            include: [ Packages ]
        })

        res.json({
            data: allBookings || []
        })
    }

})

router.get('/retrieveById/:id', async (req, res) => {

    const id = req.params.id

    const response = await Bookings.findAll({
        where: { clientId: id},
        include: [ Packages ]
    })

    if (response == null) {
        res.json({
            status: false,
            message: "You have no bookings."
        })
    } else {
        res.json({
            status: true,
            data: response
        })
    }
})

router.get('/retrieveSingleById/:id', async (req, res) => {

    const id = req.params.id

    const bookingData = await Bookings.findByPk(id, {include: [ Packages ]})

    if (bookingData == null) {
        res.json({
            status: false,
            message: "Invalid booking id URL"
        })
    } else {
        res.json({
            status: true,
            data: bookingData
        })
    }

})

router.delete('/deleteById/:id', validateToken, async (req,res) => {

    const bookingId = req.params.id

    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        await Bookings.destroy({
            where: { id: bookingId}
        })
    
        res.json({
            status: true,
            message: "The booking has been deleted succesfully."
        })
    }
})


router.get('/paypal-client-id', (req, res) => {

    res.json("AZ37TxFUHl9YZhOUu8rcyUtp.SGmAoCQxYItKJyVq7sSDWFmoHLiC3hC")

})


router.put('/update-status/:id', async (req, res) => {

        await Bookings.update(
            {
                status: "PAYED"
            },
            {
                where: { id: req.params.id}
            }
        )

        res.json({
            status: true,
            message: "Booking status updated."
        })

})



module.exports = router
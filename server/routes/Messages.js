const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Packages, Images, Sequelize, Users, Messages, Chat, sequelize } = require('../models');


router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line

router.post('/new',  validateToken, async (req, res) => {

    const { sender, textBody, packageId } = req.body

    const admin = await Users.findOne({
        where: { admin: true}
    })

    await Chat.create({
        receiverId: admin.id,
        senderId: sender,
        PackageId: packageId,
        toRead: true
    }, {
        returning: true,
        plain: true
    }).then((response) => {
        Messages.create({
            text_body: textBody,
            ChatId: response.dataValues.id,
            UserId: sender
        })
    })
    
    res.json({
        status: true,
        message: "Your booking request has been sent!"
    })
})


module.exports = router
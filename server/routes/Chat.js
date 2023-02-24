const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { Packages, Images, Sequelize, Users, Messages, Chat, sequelize } = require('../models');


router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line



router.post('/send-text/:id', validateToken,  async (req, res) => {

    const id = req.params.id
    const { sender, text_body} = req.body

    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        await Messages.create({
            text_body: text_body,
            ChatId: id,
            UserId: sender
        })
    
        await Chat.update({ toRead: true}, {where: {id: id}})
    
        req.io.emit('new_text', await Chat.findOne({
            where: { id: id},
            include: [ Messages, Packages ]
        }))
    
        req.io.on("new_text", (data) => {
            req.io.to(data.ChatId).emit("receive_message", data)
        })
    
        res.json({
            status: true
        })
    }
})


router.put('/updateToRead/:id', validateToken,  async (req, res) => {

    const id = req.params.id

    await Chat.update({
        toRead: false
    }, { where: {id: id}})

    res.json({
        status: 'Updated!'
    })

})


router.get('/byUserId/:id', validateToken,  async (req, res) => {

    const userId = req.params.id

    const userData = await Users.findOne({
        where: { id: userId}
    })

    console.log(userData)

    let data
    let senderInfo = new Array()

    if (userData.admin) {
        data = await Chat.findAll({
            where: { receiverId: userId },
            include: [ Messages, Packages ]
        })
        

    } else {
        data = await Chat.findAll({
            where: { senderId: userId },
            include: [ Messages, Packages ]
        })
    }
    res.json(data)
})

router.get('/chatHistory/:id', validateToken,  async (req, res) => {
    const chatId = req.params.id
    const data = await Chat.findOne({
        where: { id: chatId},
        include: [ Messages, Packages ]
    })
    const senderData = await Users.findOne({
        where: { id: data?.senderId}
    })
    const receiverData = await Users.findOne({
        where: { id: data.receiverId}
    })
    res.json({
        data: data || null,
        senderData: senderData,
        receiverData: receiverData
    })
})


router.get('/check-if-already-sent/:id/:sender', validateToken,  async (req, res) => {

    const senderId = req.params.sender
    const packageId = req.params.id

    const data = await Chat.findAll({
        where: { 
            packageId: packageId,
            senderId: senderId
        }
    })

    res.json({
        status: data.length > 0 ? true : false
    })

})

router.delete('/deleteById/:id', validateToken,  async (req, res) => {

    const chatId = req.params.id

    await Chat.destroy({
        where: { id: chatId}
    })

    res.json({
        status: true
    })

})


module.exports = router
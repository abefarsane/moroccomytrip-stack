const express = require('express')
const router = express.Router()
const { Services } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')


router.post('/', async (req, res) => {
    const services = req.body

    await Services.create(services)
    res.json({
        status: true
    })
})

router.post('/addToPackage', async (req, res) => {
    const service = req.body
    console.log(service)

    
    await Services.create(service)
    res.json({
        status: true
    })
    
})



router.get('/pack-services/:id', async (req, res) => {

    const id = req.params.id

    const packServices = await Services.findAll({ where: {PackageId: id} })

    res.json({
        services: packServices
    })
})

router.delete('/:serviceID', validateToken, async (req, res) => {
    const serviceID = req.params.serviceID

    await Services.destroy({
        where: {
            id: serviceID
        }
    }, {
        returning: true,
        plain: true
    }).then((response) => {
        console.log(response)
    })

    res.json({
        status: true
    })
})




module.exports = router
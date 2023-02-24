const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/AuthMiddleware')

const { Packages, Images, Sequelize } = require('../models');
const { Services } = require('../models')
const path = require('path')
router.use(express.urlencoded({ extended: true }))

let newPackageId

///////////////////////////////////////

const multer = require('multer');
const { response } = require('express');
const { rmSync } = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public', 'package-images'))
    },
    filename: (req, file, cb) => {
        console.log(file) 

        //REPLACED NAME OF THE FILE BEING UPLOADED
        cb(null, Date.now() + `_${newPackageId}` +  path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.get('/test', async (req, res) => {
    const packages = await Packages.findAll({ include: Images });
    res.json(packages)
})

router.post('/upload/package-img',  validateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'https://morocco-my-trip-api.herokuapp.com/public/package-images/' + req.file.filename

        let reqFileSplitted = req.file.filename.split('.')

        Images.create({
            type: reqFileSplitted[1],
            name: reqFileSplitted[0],
            urlPath: imgsrc,
            typeOfUse: 'pIMG',
            PackageId: newPackageId
        })
    }
    res.send('Image uploaded!')
})



router.get('/images', async (req, res) => {
    
    await Images.findAll()
        .then((response) => {
            res.json(response)
        })
})

router.get('/package-image/:id', async (req, res) => {

    const packageId = req.params.id

    await Images.findOne({
        where: {packageId: packageId}
    }).then((response) => {
        if (response != null) {
            res.json(response?.dataValues.urlPath)
        } else {
            res.json("https://morocco-my-trip-api.herokuapp.com/public/on-missing-image.jpg")
        }
        
    })
})



//////////////////////////////////////


router.post('/update/:id', validateToken, async (req, res) => {
    const updatedPackage = req.body
    const id = req.params.id

    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        await Packages.update(
            {
              title: updatedPackage.title,
              location: updatedPackage.location,
              price: updatedPackage.price,
              description: updatedPackage.description,
              people: updatedPackage.people,
              duration: updatedPackage.duration
            },
            { where: { id: id } }
        )
    
        res.json({
            status: true
        })
    }

    

})

router.post('/new', validateToken, (req, res) => {
    const newPackage = req.body


    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        Packages.create({
            title: newPackage.title,
            description: newPackage.description,
            price: parseInt(newPackage.price),
            location: newPackage.location,
            duration: newPackage.duration,
            people: newPackage.people
        }, {
            returning: true,
            plain: true
        })
        .then((response) => {
    
            const includedService = newPackage.services.included
            const notIncluded = newPackage.services.notIncluded
    
            includedService.map(service => {
                Services.create({
                    serviceBody: service.service,
                    PackageId: response.dataValues.id,
                    included: true
                })
            })
    
            notIncluded.map(service => {
                Services.create({
                    serviceBody: service.service,
                    PackageId: response.dataValues.id,
                    included: false
                })
            })
    
            newPackageId = response.dataValues.id
    
            res.json({
                packageId: response.dataValues.id,
                status: true,
                message: "Package added succesfully."
            })
        })
    }

    

})

router.get('/all', async (req, res) => {

    const packages = await Packages.findAll({
        include: Images
    })
    
    if (packages == null) {
        res.json({
            status: false,
            packages: []
        })
    } else {
        res.json({
            status: true,
            packages: packages
        })
    }
    
    
    
})

router.get('/byID/:id', async (req, res) => {
    const id = req.params.id
    const pack = await Packages.findByPk(id, {
        include: [ Services, Images ]
    })
    
    if (pack == null) {
        res.json({
            error: 'The request you have made is not valid.'
        })
    } else {
        res.json(pack)
    }
})



router.delete('/:packageID', validateToken, async (req, res) => {
    const packageID = req.params.packageID

    await Packages.destroy({
        where: {
            id: packageID
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

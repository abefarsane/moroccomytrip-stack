const { response, application } = require('express')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { validateToken } = require('../middlewares/AuthMiddleware')
router.use(express.json())

// pwd crypt
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//auth
const { Users, Sequelize } = require('../models');
const { sign } = require('jsonwebtoken')

const path = require('path')

//profile pic upload download
const multer = require('multer');
//TO PARSE INCOMING DATA
router.use(bodyParser.urlencoded({ extended: true })); //this line is already mentioned above
router.use(bodyParser.json());//add this line



//  login code
var loggedUser = {}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public', 'profile-pictures'))
    },
    filename: (req, file, cb) => {
        console.log(file) 

        //REPLACED NAME OF THE FILE BEING UPLOADED
        cb(null, Date.now() + `_${1}` +  path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.post('/test/:id', validateToken, (req, res) => {
    console.log(req.params.id)
    console.log(req.header('token'))
    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        res.json({
            idSent: req.params.id,
            message: "It works."
        })
    }
    
})

router.post('/upload-profile-pic/:userId', validateToken, upload.single('file'), (req, res) => {
    
    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        if (!req.file) {
            res.json({
                error: 'No file uploaded.'
            })
        } else {
            console.log(req.file.filename)
            /*
            var imgsrc = 'http://localhost:3001/public/profile-pictures/' + req.file.filename
    
            let reqFileSplitted = req.file.filename.split('.')
            
            Images.create({
                type: reqFileSplitted[1],
                name: reqFileSplitted[0],
                urlPath: imgsrc,
                typeOfUse: 'pIMG',
                packageId: newPackageId
            })
            */

            res.send('Image uploaded!')
        }
    }
    

})

router.get('/images', async (req, res) => {
    
    await Images.findAll()
        .then((response) => {
            res.json(response)
        })
    
})



router.post('/login', async (req, res) => {
    const { email, pwd } = req.body

    if(!pwd) {
        res.json({error: "Fill the password field."})
    }
    
    const user = await Users.findOne({ where: {email: email} }, {
        returning: true,
        plain: true
    })

    if (!user) {
        console.log("User doesn't exist.")
        res.json({error: "User doesn't exist."})
    } else {
        bcrypt.compare(pwd, user.pwd).then((match) => {
            if (!match) {
                console.log("Wrong username and password combination.")
                res.json({error: "Wrong username and password combination."})
            } else {

                const accessToken = sign({ 
                    email: user.email,
                    username: user.username, 
                    id: user.id,
                    admin: user.admin
                }, "SECRET")


                //if success then...
                res.json({token: accessToken, email: user.email, id: user.id, admin: user.admin, username: user.username})
            }
        })
    }

})

router.get('/check', validateToken, async (req, res) => {

    if (req.user) {
        const user = await Users.findOne({ where: {id: req.user.id} }, {
            returning: true,
            plain: true
        })
        res.json(user)
    } else if (req.error) {
        res.json({
            error: req.error
        })
    }
    
    //res.json(req.loggedUser)
})

router.put("/update", validateToken, async (req, res) => {
    let {type, username, id, newPwd, oldPwd} = req.body;


    if (req.error) {
        res.json({
            error: req.error
        })
    } else {
        if(type == 'usernameUpdate') {
            Users.update({ username: username}, {where: {id: id}, returning: true,
                plain: true}
            ).then((response) => {
    
                res.json({
                    message: "Updated.",
                    username: username
                })
            })
            
            
        } else if (type == 'pwdUpdate') {
            const user = await Users.findOne({ where: {id: id} })
            bcrypt.compare(oldPwd, user.pwd).then(async (match) => {
                if (!match) {
                    res.json({status: { 
                        text: "The old password is incorrect.",
                        id: false
                    }
                    })
                } else {
                    const salt = await bcrypt.genSalt(10)
                    await bcrypt.hash(newPwd, salt).then((hash) => {
                        Users.update({ pwd: hash}, {where: {id: id}})
                        res.json({status: {
                            text: "Your password have been updated.",
                            id: true
                        }})
                    })
                }
            })
        } 
    }

   

})

router.post('/signup', async  (req, res) => {

    let { username, email, pwd} = req.body;

    await bcrypt.genSalt(10,  (err, salt) => {
        bcrypt.hash(pwd, salt, async (err, hash) => {
            
            
            await Users.create({
                username: username,
                email: email,
                pwd: hash,
            }).then(function(item){
              res.json({
                status: true,
                data: item
              });
            }).catch(function (err) {
                res.json({
                    error: err
                })
            });
        });
    });

})

router.get('/userById/:id', async (req,res) => {


    const id = req.params.id

    const user = await Users.findByPk(id, {
        attributes: {exclude: ['pwd', 'admin']}
    })
    res.json(user)

})


module.exports = router
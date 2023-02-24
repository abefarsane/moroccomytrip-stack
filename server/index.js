const express =  require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const db = require('./models')
const http = require('http')
const { Server } = require('socket.io') 
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    cors({
        credentials: true,
        methods: ["GET","POST","PUT", "DELETE"]
    })
);
app.use('/public/package-images', express.static(path.join(__dirname, 'public', 'package-images')));
app.use('/public/profile-pictures', express.static(path.join(__dirname, 'public', 'profile-pictures')));
app.use('/public', express.static(path.join(__dirname, 'public')));

//LIVE CHAT SETTINGS

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        methods: ["GET","POST","PUT", "DELETE"]
    }
})

app.use((req, res, next) => {
    req.io = io;
    return next();
});



const userRouter = require('./routes/Users')
app.use("/auth", userRouter)

const packagesRouter = require('./routes/Packages')
app.use("/packages", packagesRouter)

const servicesRouter = require('./routes/Services')
app.use("/services", servicesRouter)

const messagesRouter = require('./routes/Messages')
app.use("/messages", messagesRouter)

const chatRouter = require('./routes/Chat')
app.use("/chat", chatRouter)

const bookingsRouter = require('./routes/Bookings')
app.use("/bookings", bookingsRouter)




db.sequelize.sync()
    .then(() => {
        httpServer.listen(process.env.PORT || 3001, () => {
        console.log("Server running on port 3001")
    })
}).catch((err) => {
    console.log(err)
})

//middleware that we put inside router.post("/", MIDDLEWARE, (res, req))
// to check whether the token is valid or not
const {verify} =  require('jsonwebtoken')


const validateToken = (req, res, next) => {
    const accessToken = req.header("token")

    if (!accessToken) {
        req.error = "User not logged in."
        return next()
    } 

    try {
        const validToken = verify(accessToken, "SECRET")

        if(validToken) {
            req.user = validToken
            return next()
        }
    } catch(err) {
        req.error = err
        return next()
    }
}


module.exports = { validateToken }
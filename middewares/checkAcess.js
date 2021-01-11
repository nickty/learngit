const jwt = require('jsonwebtoken')
require('dotenv').config()


const checkUser = (req, res, next) => {
    //get tthe token from header
    const token = req.header('x-auth-token')

    //check if no token 
    if(!token){
        return res.status(401).json({ msg : 'No Token, authorization failed'})

    }


    
    //verify token 
    try {
        const payload = jwt.verify(token, process.env.jwtSecret)

        //console.log(decoded.user)


        req.user = payload.user; 
        next(); 
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid'})
    }
}

module.exports = checkUser
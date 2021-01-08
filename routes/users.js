const ex = require('express')
const router = ex.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const { findOne } = require('../models/User')

const User = require('../models/User')


router.post('/user',[
    check('name', 'Name is required').not().isEmpty(), 
    check('email', 'Email is required').isEmail(), 
    check('password', 'Password is not correct').isLength({min:6})
], async (req, res) => {
    
    const errors =  validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name,email,password} = req.body

    let dbuser = await User.findOne({email})

    if(dbuser){
        return res.status(400).json({errors: [{msg: 'User Already Exist'}]})
    }


    const user = new User({
        name, 
        email, 
        password
    })

    
    //entrypt password 
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(password, salt)


    //prepare user to save into database 
    await user.save()

    //return jsonwebtoken

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(payload, process.env.jwtSecret, {expiresIn: 360000}, (err, token) => {
        if(err){
            throw err; 
        } else {
            res.json({token})
        }
    })
})


module.exports = router

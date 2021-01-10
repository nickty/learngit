const ex = require('express')
const router = ex.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')

const User = require('../models/User')


router.post('/register',[
    check('name', 'Name is required').not().isEmpty(), 
    check('email', 'Email is required').isEmail(), 
    check('password', 'Password is not correct').isLength({min:6}), 
    check('age', 'Age is required').not().isEmpty()
], async (req, res) => {
    
    const errors =  validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name,email,password,age} = req.body

    let dbuser = await User.findOne({email})

    //console.log(dbuser.email)

    if(dbuser){
        return res.status(400).json({errors: [{msg: 'User Already Exist'}]})
    }

    

    const user = new User({
        name, 
        age,
        email, 
        password
    })

    
    //entrypt password 
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(password, salt)

    //console.log(user.id)
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

router.post('/login', [
    check('email', 'Email is required').isEmail(), 
    check('password', 'Password required').exists()
], async (req, res)=> {

    const errors =  validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({errors: [{msg: 'You are not registered member, plz Register!'}]})
        }

    console.log(user)

    const isMatch = await bcrypt.compare(password, user.password)    

    if(!isMatch){
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})    
    }

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

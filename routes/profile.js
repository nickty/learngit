const express = require('express')
const router = express.Router()

const checkUser = require('../middewares/checkAcess')
const Profile = require('../models/Profile')

//create profile 
router.post('/', checkUser, async (req, res) => {

    const {company, website, location, status} = req.body

    const profileFields = {};
    profileFields.user = req.user.id 
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(status) profileFields.status = status

    try {

        let profile = await Profile.findOne({user: req.user.id}); 

        if(profile){
            //update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new:true})

            return res.json(profile)
        }

        //create
        profile = new Profile(profileFields)
        await profile.save() 
        res.json(profile)
        
    } catch (error) {
       console.error(error.message)
       res.status(500).send('Server Error') 
    }
})

//private route
router.post('/me', checkUser, async (req, res)=>{

    console.log('working')
       
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user', ['name', 'avatar'])
        
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }

        res.json(profile); 
    } catch (error) {
        console.error(err.message); 
        res.status(500).send('Server Error')
    }
    
})


module.exports = router
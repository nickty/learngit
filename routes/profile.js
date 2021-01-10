const express = require('express')
const router = express.Router()

const checkUser = require('../middewares/checkAcess')

router.post('/', checkUser, (req, res)=>{

    res.send(req.user)
})

module.exports = router
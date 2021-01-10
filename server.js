const exp = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


const app = exp()

//db connection 
mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useFindAndModify: true
}).then(()=>console.log("DB connected"))

app.use(exp.json())

app.get('/', (req, res) => res.send('hi'))


app.use('/user', require('./routes/users'))
app.use('/profile', require('./routes/profile'))


const port = process.env.PORT || 8000
app.listen(port, ()=>console.log(`Server is running on port ${port}`))


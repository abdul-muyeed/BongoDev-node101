require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(bodyParser.json())
const uri = process.env.MONGOBD_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err))


const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    age: Number,
   
},{
    timestamps: true
}
)

const User = mongoose.model('User', userSchema)



app.get('/', (req, res) => {
    res.json({ message: 'Welcome to our application' })
    
})

app.post('/users', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const password = hash
        const userObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: password,
            age: req.body.age
            
        }
        const user = new User(userObj)
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
})
app.post('/users/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }else{
            const validPassword = await bcrypt.compare(password, user.password)
            if(validPassword){
                const token = jwt.sign({email: user.email, id: user._id},'secret')
                const userObj = user.toJSON()
                userObj.accessToken = token
                res.status(200).json(userObj)
            }else{
                return res.status(401).json({message: 'Invalid password'})
            }
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
})

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.json(users)
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
    
})
app.get('/users/:id', async (req, res) => {
    try{
        const id = req.params.id
        const user = await User.findById(id)
        if(user){
            res.json(user)
        }else{
            res.status(404).json({message: 'User not found'})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
    

})
app.put('/users/:id', async (req, res) => {
    
    try{
        const id = req.params.id
        const body = req.body
        const user = await User.findByIdAndUpdate(id,body,{new: true})
        if(user){
            res.json(user)
        }else{
            res.status(404).json({message: 'User not found'})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
})
app.delete('/users/:id', async (req, res) => {
    
    try{
        const id = req.params.id
        const user = await User.findByIdAndDelete(id) 
        if(user){
            res.json({message: `User number ${id} deleted`})
        }else{
            res.status(404).json({message: 'User not found'})
        }
    }catch(err){
        console.error(err)
        res.status(500).json({message: err.message})
    }
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
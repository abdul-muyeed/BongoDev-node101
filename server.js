require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
const uri = process.env.MONGOBD_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err))


const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    age: Number,
   
},{
    timestamps: true
}
)

const User = mongoose.model('User', userSchema)



app.get('/', (req, res) => {
    res.json({ message: 'Welcome to our application' })
    
})
let users =[]
let id = 0
let getUserbyID = (req) => {
    const id = req.params.id
    const user = users.find(u => u.id == id)
    return user
}
app.post('/users', async (req, res) => {
    //res.json({ message: 'Welcome to our application.' })
    
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).json(user)
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
// localhost:5000/users 
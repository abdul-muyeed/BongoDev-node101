require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
app.post('/users', (req, res) => {
    //res.json({ message: 'Welcome to our application.' })
    const user = req.body
    user.id = ++id
    users.push(user)
    res.status(201).json(user)
})

app.get('/users', (req, res) => {
    res.json(users)
})
app.get('/users/:id', (req, res) => {
    const user = getUserbyID(req)
    if(user){
        res.json(user)
    }else{
        res.status(404).json({message: 'User not found'})
    }

})
app.put('/users/:id', (req, res) => {
    const user = getUserbyID(req)
    if(user){
        user.fname = "Hakim"
        res.json(user)
    }else{
        res.status(404).json({message: 'User not found'})
    }
})
app.delete('/users/:id', (req, res) => {
    const id = req.params.id
    const user = users.find(u => u.id == id)
    if(user){
        users = users.filter(u => u.id != id)
        res.json({message: `User number ${id} deleted`})
    }else{
        res.status(404).json({message: 'User not found'})
    }
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
// localhost:5000/users 
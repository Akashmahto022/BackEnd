require('dotenv').config()

const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/akash', (req,res)=>{
    res.send("hello Akash you are on the /akash route")
})

app.get('/login', (req, res)=>{
  res.send('<h1>please login</h1>')
})

app.get('/youtube', (req, res)=>{
  res.send("you are watching youtube video for the bcakend")
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
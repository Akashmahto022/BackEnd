const express = require('express')
require('dotenv').config()
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')

})

app.get('/name', (req, res)=>{
    res.send("Your Name Is Akash Mahto")
})

app.get('/login',(req, res)=>{
    res.send(
        {
            name: "Akash",
            age: 20
        },
        {
            name: "Rahul",
            age: 26
        },
    )
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})



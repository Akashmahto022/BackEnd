import express from "express"

const app = express()

app.get('/api/serve', (req, res)=>{
    res.send('server is ready')
})
app.get('/api/yourname', (req, res)=>{
    res.send('my name is Akash Mahto and I am the author of this backend')
})

//five jokes api
app.get('/api/lamejokes/jokes', (req, res)=>{
    const jokes = [
        {
            id: 1,
            title: "A joke",
            content: "This is a joke"
        },
        {
            id: 2,
            title: "Another joke",
            content: "This s another joke"
        },
        {
            id: 3,
            title: "third joke",
            content: "This 1s third joke"
        },
        {
            id: 4,
            title: "fouth joke",
            content: "This is fourth joke"
        },
        {
            id: 5,
            title: "fifth joke",
            content: "This is fifth joke"
        },
    ]
    res.send(jokes)
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`server is ready at http://localhost:${port}`);
})
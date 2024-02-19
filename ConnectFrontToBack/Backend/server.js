import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.get('/profile', (req, res)=>{
    res.send("greate ")
})

app.get('/api/jokes', (req, res)=>{
    const jokes = [
        {
            id: 1,
            title: "first joke",
            content: "this is first joke"
        },
        {
            id: 2,
            title: "seccond joke",
            content: "this is seccond joke"
        },
        {
            id: 3,
            title: "third joke",
            content: "this is third joke"
        },
        {
            id: 4,
            title: "fourth joke",
            content: "this is fourth joke"
        },
        {
            id: 5,
            title: "five joke",
            content: "this is five joke"
        },
    ]
    res.send(jokes)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});

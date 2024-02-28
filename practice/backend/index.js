import express  from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/akash", (req, res)=>{
    res.send("i can become software engineer top of 1% in the entire world")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

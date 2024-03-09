// require('dotenv').config({path: './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});
  
connectDB()
  .then(() => {
    app.on("error", (error)=>{
      console.log(error)
      throw error
    })

    app.listen(process.env.PORT || 4000, (req, res) => {
      console.log(`server is ru ning at port: ${process.env.PORT} `);
    });
  })
  .catch((error) => {
    console.log("mongoDB connection failed !!! ", error);
  });

// import { express } from "express";

// const app = express()

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
//     app.on("error", (error)=>{
//         console.log("error", error)
//         throw error
//     })
//     app.listen(process.env.PORT, ()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//     })
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// })();

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './env'
})

connectDB() 
.then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`server running at ${process.env.PORT}`)
    })
})
.catch((error)=>{   
    console.log("MongoDB connection failed !!" , error)
})















// import express from 'express'
// const app = express()

// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error',(error)=>{
//             console.log("Error in connecting DB", error)
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error in connecting DB" , error)
//     }
// })()



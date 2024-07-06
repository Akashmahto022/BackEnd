import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

const connectDB = async()=>{
    try {
        const connectionInstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MondoDB connected !! DB Host : ${connectionInstant.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error", error)
        process.exit(1)
    }
}

export default connectDB;
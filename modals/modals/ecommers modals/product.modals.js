import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        
    }
}, {timestamps:true})

export const Product = mongoose.model("Product", productSchema)
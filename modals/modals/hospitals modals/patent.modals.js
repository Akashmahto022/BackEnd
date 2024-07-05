import mongoose from 'mongoose'

const patentSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        diagonsedWith: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        bloodGroup: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        admitedIn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    }, {timestamps:true})

export const Patent = mongoose.model("Patent", patentSchema)
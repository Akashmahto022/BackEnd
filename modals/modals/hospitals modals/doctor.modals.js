import mongoose from 'mongoose'

const doctoreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        salary: {
            type: String,
            required: true
        },
        qualification:{
            type: String,
            required: true
        },
        experienceInYears: {
            type:Number,
            default: 0
        }
    }, {timestamps:true})

export const Doctor = mongoose.model("Doctor", doctoreSchema)
import { asyncHandler } from "../utils/asyncHandler.js";

const practiceController = asyncHandler(async (req, res)=>{
    res.status(200).json({
        id:1,
        name:"Rahul Mahto"
    })
})

export {practiceController}
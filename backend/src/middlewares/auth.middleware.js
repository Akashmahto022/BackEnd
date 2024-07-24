import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new apiError(401, "Unauthorized requrest")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        if (!user) {
            // todo discuss about front end
            throw new apiError(401, "invalid Access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log(error)
        throw new apiError(401, error?.message || "invalid access token")
    }
});

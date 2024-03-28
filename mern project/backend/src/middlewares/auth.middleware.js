import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";
import { user } from "../models/user.model";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        
      const token =
        (await req.cookies?.accessToken) ||
        req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
       const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
      const userId = await user.findById(decodedToken?._id).select("-password -refreshToken")
    
      if (userId) {
        // Todo discuss about frontend
        throw new ApiError(401, "Invalid Access Token")
      }
    
      req.userId = userId;
      next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }});


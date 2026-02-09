import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler( async (req , res , next) => {
    try{
        const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken){
            throw new ApiError(401 , "Access token not found, UnAuthorized Request");
        }

        const decoded = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401 , "User not found");
        }
        req.user = user;
        next();
    }
    catch(err){
        throw new ApiError(401 , err?.message || "Access token not found, UnAuthorized Request");
    }
})  


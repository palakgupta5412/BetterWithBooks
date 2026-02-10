import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// --- HELPER: Generate Tokens ---
const generateAccessAndRefreshToken = async(userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

// --- CONFIG: Cookie Options for Localhost ---
// secure: true ONLY works on HTTPS. On localhost (HTTP), it must be false.
const options = {
    httpOnly: true,
    secure: false, // CHANGE TO FALSE FOR LOCALHOST
    sameSite: "lax" 
};

// 1. REGISTER (Now logs you in automatically!)
const register = asyncHandler( async (req, res) => {
    const { name , email , password } = req.body;
    console.log("🔥 REGISTER ROUTE HIT 🔥");

    if([name , email , password].some((field)=>field?.trim() === "")){
        throw new ApiError(400 , "All fields are required");
    }

    const isExists = await User.findOne({ email });
    if(isExists){
        throw new ApiError(409 , "User already exists");
    } 

    const newUser = await User.create({
        name, 
        email, 
        password 
    });

    const createdUser = await User.findById(newUser._id).select('-password -refreshToken');

    if(!createdUser){
        throw new ApiError(500 , "Error creating user");
    }

    // --- FIX: GENERATE TOKENS IMMEDIATELY ---
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

    return res
    .status(201)
    .cookie("accessToken", accessToken, options) // Send Cookie
    .cookie("refreshToken", refreshToken, options) // Send Cookie
    .json(
        new ApiResponse(201 , { user: createdUser, accessToken, refreshToken } , "User registered and logged in")
    );
});

// 2. LOGIN
const login = asyncHandler( async (req, res) => {
    const { email , password } = req.body;
    
    if(!(email && password)){
        throw new ApiError(400 , "Email and password are required");
    }

    const user = await User.findOne({ email });
    if(!user){
        throw new ApiError(401 , "User not found");
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid password");
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedUser = await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options) // Uses the HTTP-friendly options
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(200 , { user : loggedUser , accessToken , refreshToken } , "User logged in successfully")
    );
})

// 3. LOGOUT
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

// 4. GET CURRENT USER
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        req.user, 
        "User fetched successfully"
    ));
});

export {
    register,
    login, 
    logout, 
    getCurrentUser
}
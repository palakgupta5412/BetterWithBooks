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

// --- CONFIG: Cookie Options ---
// ⚠️ IMPORTANT: For Vercel/Render deployment, 'secure' MUST be true and 'sameSite' MUST be 'None'.
// If you set secure: false in production, login will fail.
const options = {
    httpOnly: true,
    secure: true,      // REQUIRED for Vercel/Render (HTTPS)
    sameSite: "None",  // REQUIRED for Cross-Site (Vercel -> Render)
    path: "/"          // Ensures cookie is valid for all routes
};

// 1. REGISTER
const register = asyncHandler( async (req, res) => {
    const { name , email , password } = req.body;

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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
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

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid password");
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedUser = await User.findById(user._id).select('-password -refreshToken');

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
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

// 5. CHANGE PASSWORD
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and New passwords are required");
    }

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
    register,
    login, 
    logout, 
    getCurrentUser,
    changeCurrentPassword
}
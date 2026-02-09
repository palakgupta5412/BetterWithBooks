import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
    // We fetch the user to ensure we have the latest version
    const user = await User.findById(userId); 
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the Refresh Token in the Database
    user.refreshToken = refreshToken;
    
    // ValidateBeforeSave: false prevents checking other required fields like 'password'
    await user.save({ validateBeforeSave: false }); 

    return { accessToken, refreshToken };
}

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
        name , 
        email , 
        password 
    });

    const createdUser = await User.findById(newUser._id).select('-password -refreshToken');

    if(!createdUser){
        throw new ApiError(500 , "Error creating user");
    }

    return res.status(201).json(
        new ApiResponse(201 , "User created successfully" , createdUser)
    );
    
});

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

    const options = {
      httpOnly: true,
      secure: true,      
      sameSite: "none"
    };

    return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(new ApiResponse(200 , { user : loggedUser , accessToken , refreshToken } , "User logged in successfully"));
})

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,     // 🔥 localhost fix
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export {
    register,
    generateAccessAndRefreshToken,
    login, 
    logout
}
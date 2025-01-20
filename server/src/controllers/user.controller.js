import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';


const generateAccessAndRefreshToken = async(userId) => {
    try {
         const user = await User.findById(userId);
         const accessToken = user.generateAccessToken();
         const refreshToken = user.generateRefreshToken();
         user.refreshToken = refreshToken
         await user.save({validateBeforeSave: false});

         return {accessToken, refreshToken};

    } catch (error) {
         throw new ApiError(500, "something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
   
     const {username, email, fullname, password} = req.body
   //   console.log("email", email);
   //   if(!username || !email || !fullname || !password){
   //       throw new AppError(400, 'Please provide all required fields')
   //   }
   if(
      [username, email, fullname, password].some((field) => field?.trim() === "")
   ){
         throw new ApiError(400, 'Please provide all required fields')
   }
   const existedUser = await User.findOne({
      $or: [{username}, {email}]
   })
   if(existedUser){
      throw new ApiError(409, 'User already exists')
   }
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, 'Please provide an avatar')
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(!avatar){
      throw new ApiError(400, 'avatar file is required')
   }
   const user = await User.create({
      username,
      email,
      fullname,
      password,
      avatar: avatar.url || ""
   })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   if(!createdUser){
   throw new ApiError(500, "something went wrong while registering user");
   }
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
   );
     
});

const loginUser = asyncHandler(async (req, res) => {

     const {username, email, password} = req.body;

   if(!email || !username){
      throw new ApiError(400, 'Please provide email and password')
   }
   const user = await User.findOne({
      $or: [{email}, {username}]
   })
   if(!user){
      throw new ApiError(404, 'User  does not exist')
   }
   
   const isPasswordValid = await user.isPasswordCorrect(password);
   if(!isPasswordValid){
      throw new ApiError(401, 'Invalid user credentials')
   }
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

   logedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   const options = {
      httpOnly: true,
      secure: true,
   }

   return res.
   status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(
         200, 
         {
            user: logedInUser, accessToken, refreshToken

         }, 
         "User logged in successfully"
      )
   );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, 
     {
      $set: {refreshToken: undefined}
     },
     {
      new: true,
     }

  )
  const options = {
   httpOnly: true,
   secure: true,
  }
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(
      new ApiResponse(200, {}, "User logged out successfully")
   );
});
export {
   registerUser,
   loginUser,
   logoutUser
}
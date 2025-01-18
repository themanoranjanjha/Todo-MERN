import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/AppError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';


const registerUser = asyncHandler(async (req, res) => {
   
     const {username, email, fullname, password} = req.body
     console.log("email", email);
   //   if(!username || !email || !fullname || !password){
   //       throw new AppError(400, 'Please provide all required fields')
   //   }
   if(
      [username, email, fullname, password].some((field) => field?.trim() === "")
   ){
         throw new AppError(400, 'Please provide all required fields')
   }
   const existedUser = User.findOne({
      $or: [{username}, {email}]
   })
   if(existedUser){
      throw new AppError(409, 'User already exists')
   }
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   if(!avatarLocalPath){
      throw new AppError(400, 'Please provide an avatar')
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(!avatar){
      throw new AppError(400, 'avatar file is required')
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
   throw new AppError(500, "something went wrong while registering user");
   }
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
   );
     
});

export {registerUser}
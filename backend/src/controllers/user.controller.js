import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";

// register user
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation for email and not empty
  // check if user already exists: username , email
  // check file images and avatar
  // upload them to cloundinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return

  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser =await User.findOne({ $or: [{ email }, { userName }] });

  if (existedUser) {
    throw new apiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files/coverImage.length >0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "profile image is required");
  }

  const avatar = await uploadOnCloundinary(avatarLocalPath);
  const coverImage = await uploadOnCloundinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "profile image is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    userName: userName.toLowerCase(),
    email,
    password,
  }); 

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something wrong while register user");
  }

  return res.status(201).json(new apiResponce(200, createdUser, "user register successfully"));
});

export { registerUser };



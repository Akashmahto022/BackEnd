import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloundnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

  // get user details from frontend
  // validation -- not empty
  // check if the user already exists: userName, email
  // check for images, check for avatar
  // if available then upload them to upload On Cloundnary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation 
  // return res



  const { fullName, email, userName, password } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, userName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or password already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloundnary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required yet");
  }

  const coverImageLocalPth = req.files?.coverImage[0]?.path;
  const coverImage = await uploadOnCloundnary(coverImageLocalPth);

  const userData = await user.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await user
    .findById(userData._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };

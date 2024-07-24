import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new apiError(500, "error while generating referesh and access token");
  }
};

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

  const existedUser = await User.findOne({ $or: [{ email }, { userName }] });

  if (existedUser) {
    throw new apiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files / coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
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

  return res
    .status(201)
    .json(new apiResponce(200, createdUser, "user register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // take email and password from req body
  // check email and username and password
  // find the user
  // Validate password
  // access and refresh token
  // send token in cookie

  const { email, userName, password } = req.body;
  if (!userName || !email) {
    throw new apiError(400, "username or passord is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new apiError(404, "user dosen't exists");
  }

  const isPasswrodCorrect = await user.isPasswrodCorrect(password);
  if (!isPasswrodCorrect) {
    throw new apiError(401, "Wrong password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refreshToken, options)
    .json(
      new apiResponce(
        200,
        { user: logedInUser, accessToken, refreshToken },
        "User LogedIn SuccessFully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.body._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refereshToken", option)
    .json(new apiResponce(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthorized request");
  }

  try {
    const decode = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOEKN_SECRET
    );
    const user = await User.findById(decode?._id);
    if (!user) {
      throw new apiError(401, "invalid refresh token");
    }
  
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "refresh token is expired");
    }
   const {accessToken, refreshToken} = await generateAccessAndRefereshToken(user._id)
  
    const options = {
      httpOnly:true,
      secure:true
    }
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponce(
        200, 
        {accessToken, refreshToken},
        "Access Token refresh"
      )
    )
  } catch (error) {
    throw new apiError(401, error?.message || "invalid refresh token")
  }

});

export { registerUser, loginUser, logoutUser, refreshAccessToken };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloundnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const userToken = await user.findById(userId);
    const accessToken = userToken.generateAccessToken();
    const refreshToken = userToken.generateRefreshToken();
    // console.log(userToken, accessToken)
    userToken.refreshToken = refreshToken;
    // console.log(userToken.refreshToken)
    await userToken.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

// register user
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
  // console.log("email: ", email);

  if (
    [fullName, email, userName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await user.findOne({
    $or: [{ userName }, { email }],
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

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloundnary(coverImageLocalPath);

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

//login user
const loginUser = asyncHandler(async (req, res) => {
  //thing to do when user going to register
  // get the data from the user (req.body -> data)
  // login with userName or email
  // find the user
  // password check
  // access and refresh Token
  // send cookie

  const { userName, email, password } = req.body;
  // console.log(email, password)

  if (!(userName || email)) {
    throw new ApiError(400, "username/email or password is required");
  }

  const userInformation = await user.findOne({
    $or: [{ userName }, { email }],
  });

  if (!userInformation) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await userInformation.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userInformation._id
  );

  const loggedInUser = await user
    .findById(userInformation._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userInformation: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfuly"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await user.findByIdAndUpdate(
    req.userId._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Loged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToekn =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToekn) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToekn = jwt.verify(
      incomingRefreshToekn,
      process.env.REFRESH_TOKEN_SECRET
    );

    const userId = await user.findById(decodedToekn?._id);

    if (!userId) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToekn !== userId?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(userId._id);
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access and refresh token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const currentUser = await user.findById(req.userId?._id);

  const isPasswordCorrect = await currentUser.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  currentUser.password = newPassword;
  await currentUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "pasword change succesfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.userId, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async(req, res)=>{
  const {fullName, email} = req.body

  const updateUser = user.findByIdAndUpdate(
    req.userId?._id,
    {
      $set:{
        fullName: fullName,
        email: email
      }
    },
    {new: true}
    
  ).select("-password")
  return res
  .status(200)
  .json(new ApiResponse(200,updateUser, "Account Details Update Successfully" ))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missinf")
  }

  const avatar = await uploadOnCloundnary(avatarLocalPath)
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar")
  }

  await user.findByIdAndUpdate(
    req.userId?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(ApiResponse(200, avatar.url, "update avatar image successfully"))
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloundnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const userToken = await user.findById(userId);
    const accessToken = userToken.generateAccessToken();
    const refreshToken = userToken.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.Save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

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
  console.log(avatarLocalPath);
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
  console.log(req.files);
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

const loginUser = asyncHandler(async (req, res) => {
  //thing to do when user going to register
  // get the data from the user (req.body -> data)
  // login with userName or email
  // find the user
  // password check
  // access and refresh Token
  // send cookie

  const { userName, email, password } = req.body;
  if (!userName || !email) {
    throw new ApiError(400, "username/email or password is required");
  }

  const userInformation = await user.findOne({
    $or: [{ userName }, { email }],
  });

  if (!userInformation) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToekn", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfuly"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await user.findByIdAndUpdate(req.userId._id, 
    {
      $set:{
        refreshToken: undefined
      }
    },
    {
      new: true
    }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Loged Out"))
});

export { registerUser, loginUser, logoutUser };

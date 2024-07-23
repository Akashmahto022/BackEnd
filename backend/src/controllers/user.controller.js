import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefreshToken();

    user.refereshToken = refereshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refereshToken };
  } catch (error) {
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

  const { accessToken, refereshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refereshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
      new apiResponce(200, { user: logedInUser, accessToken, refereshToken }, "User LogedIn SuccessFully")
    );
});

export { registerUser, loginUser };

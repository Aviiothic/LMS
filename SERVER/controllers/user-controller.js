import AppError from "../utils/error-util.js";
import User from "../models/user-model.js";

// Options for cookie
const cookieOptions = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
};


//handling regsitration of user
const registerUser = async (req, res, next) => {
  try{
    const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("Email already exists", 409));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(
      new AppError("User registration failed, please try again later", 400)
    );
  }

  await user.save();

  const token = await user.generateJWTToken();

  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
  }catch(error){
    return next(new AppError(error.message, 500))
  }
};


const getProfile = async (req, res, next) => {
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password does not match", 401));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = async (req, res, next) => {
}

export{
    registerUser,
    getProfile,
    login,
    logout
}
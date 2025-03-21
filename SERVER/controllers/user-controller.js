import AppError from "../utils/error-util.js";
import User from "../models/user-model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// Options for cookie
const cookieOptions = {
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
};

//handling regsitration of user
const registerUser = async (req, res, next) => {
  try {
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

    if (req.file) {
      console.log(req.file);
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
          height: 150,
          gravity: "faces",
          crop: "fill",
        });

        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        //Remove file from local system
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(new AppError(error.message, 500));
      }
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
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//handling fetching of user profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "user details",
      user,
    });
  } catch (error) {
    return next(new AppError("failed to fetch user details", 500));
  }
};

//handling login of user
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

//handling logout of user
const logout = async (req, res, next) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

//handling forgot password of user
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body;

    if (!email) {
      return next(AppError("Please Enter Email", 404));
    }

    const user = await User.findOne(email);
    if (!user) {
      return next(AppError("Email Not Registered", 404));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    

    try {
      await sendEmail(email, subject, message);
      res.status(200).json({
        sucess: true,
        message: `Reset password token has been sent to ${mail} successfully !`,
      });
    } catch (error) {
      user.forgetPasswordToken = undefined;
      user.forgetPasswordExpiry = undefined;

      await user.save();
      return next(new AppError("Email could not be sent", 500));
    }
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//handling change password of user
const changePassword = async (req, res, next) => {};

export {
  registerUser,
  getProfile,
  login,
  logout,
  forgotPassword,
  changePassword,
};

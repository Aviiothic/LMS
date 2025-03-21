import express from "express";
import {
  getProfile,
  registerUser,
  login,
  logout,
  forgotPassword,
  changePassword,
} from "../controllers/user-controller.js";

import isLoggedIn from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js"

const router = express.Router();

router.get("/profile", getProfile);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", isLoggedIn, login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);

export default router;

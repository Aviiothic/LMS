import express from "express";
import {
  getProfile,
  registerUser,
  login,
  logout,
} from "./controllers/user-controller.js";

const router = express.Router();

router.get("/profile", getProfile);
router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);

export default router;

const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user db
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.get("/username/:username", userController.userProfil);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// upload
router.post("/upload", uploadController.uploadProfil);

module.exports = router;

// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");

authRouter.get("/api/auth/login", authController.getLogin);
authRouter.post("/api/auth/login", authController.postLogin);
authRouter.post("/api/auth/logout", authController.postLogout);
authRouter.get("/api/auth/signup", authController.getSignup);
authRouter.post("/api/auth/signup", authController.postSignup);
authRouter.get("/api/auth/check-session", authController.checkSession);

module.exports = authRouter;

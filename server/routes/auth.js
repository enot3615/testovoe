import express from "express";
import userController from "../controllers/controller.user.js";

const auth = express.Router();

auth.post("/login", userController.login)
auth.post("/registration", userController.registration)

export default auth;
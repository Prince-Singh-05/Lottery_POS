import express from "express";
import { login, signup } from "../controllers/auth.controller.js";
import { getCustomerReport } from "../controllers/ticket.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/customerReport", auth, getCustomerReport);

export default userRouter;

import express from "express"
import usersController from "../controllers/usersController.js";
import validateBody from "../helpers/validateBody.js";
import { userSigninSchema, userSignupSchema, userEmailSchema } from "../models/User.js";
import authenticate from "../middlewares/authenticate.js"
import upload from "../middlewares/upload.js"



const authRouter = express.Router()

authRouter.post("/register", validateBody(userSignupSchema), usersController.register);
authRouter.post("/login", validateBody(userSigninSchema), usersController.login);
authRouter.get("/verify/:verificationToken", usersController.verify);
authRouter.post("/verify", validateBody(userEmailSchema), usersController.resendVerify);
authRouter.get("/current", authenticate, usersController.getCurrent);
authRouter.post("/logout", authenticate, usersController.logout);
authRouter.patch("/avatars", upload.single("avatar"), authenticate, usersController.updateAvatar);

export default authRouter;
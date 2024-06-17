import express from "express"
import usersController from "../controllers/usersController.js";
import validateBody from "../helpers/validateBody.js";
import { userSigninSchema, userSignupSchema } from "../models/User.js";
import authenticate from "../middlewares/authenticate.js"


const authRouter = express.Router()

authRouter.post("/register", validateBody(userSignupSchema), usersController.register);
authRouter.post("/login", validateBody(userSigninSchema), usersController.login);
authRouter.get("/current", authenticate, usersController.getCurrent);
authRouter.post("/logout", authenticate, usersController.logout);

export default authRouter;
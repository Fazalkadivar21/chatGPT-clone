import {register, login, logout} from "../controllers/user.controllers"
import { Router } from "express"
import {verifyUser} from "../middlewares/auth.middleware"

export const userRouter: Router = Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",verifyUser,logout)

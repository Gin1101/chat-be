import { Router } from "express"
import userController from "./user.controller.js"
import { verifyMiddleware } from "#src/middleware/auth.js"

const router = Router()

router.get("/info", verifyMiddleware(), userController.getUserInfo)

export default router
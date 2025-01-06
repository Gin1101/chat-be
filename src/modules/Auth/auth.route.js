import { Router } from "express";
import AuthController from "./auth.controller.js"
import { validate } from "#src/validate/request.validate.js";
import AuthSchema from "./auth.schema.js";

const router = Router();

router.post("/login", validate(AuthSchema.loginSchema), AuthController.login)

router.post("/verify", validate(AuthSchema.verifyTokenSchema), AuthController.verifyToken3rd)

export default router;
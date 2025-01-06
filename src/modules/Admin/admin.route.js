import { Router } from "express";
import { verifyMiddleware } from "#src/middleware/auth.js";
import { validate } from "#src/validate/request.validate.js";
import adminController from "./admin.controller.js";
import adminSchema from "./admin.schema.js";

const router = Router();

router.post("/login", validate(adminSchema.loginSchema), adminController.login)

router.get("/chat/settings", verifyMiddleware("admin"), adminController.getChatSttings)
router.put("/chat/settings", verifyMiddleware("admin"), validate(adminSchema.setChatSettingsSchema), adminController.updateChatSttings)

export default router;
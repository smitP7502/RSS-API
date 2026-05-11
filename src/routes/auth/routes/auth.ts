import { Router } from "express";
import { LoginSchema, ResetPwdSchema } from "../schema/auth.schema";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../../../middlewares/validate";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authenticate } from "../../../middlewares/authenticate";

const router = Router();

router.post("/login", validate(LoginSchema), asyncHandler(AuthController.login));
router.use(authenticate);
router.post("/resetPassword", validate(ResetPwdSchema), asyncHandler(AuthController.resetPassword));

export default router;

import { Router } from "express";
import { LoginSchema, ResetPwdSchema } from "../schema/auth.schema";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../../../middlewares/validate";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authenticate } from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/authorize";

const router = Router();

router.post("/login", validate(LoginSchema), asyncHandler(AuthController.login));
router.use(authenticate);
router.post("/change-password", validate(ResetPwdSchema), asyncHandler(AuthController.changePassword));
router.use(authorize("ADMIN"));
router.post("/credentials/:id/reset", validate(ResetPwdSchema), asyncHandler(AuthController.reset));

export default router;

import { Router } from "express";
import { RegisterMemberSchema, UpdateMemberSchema } from "../schema/member.schema";
import { authenticate } from "../../../middlewares/authenticate";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authorize } from "../../../middlewares/authorize";
import { validate } from "../../../middlewares/validate";
import { MemberController } from "../controller/member.controller";

const router = Router()

router.use(authenticate)
router.get("/get/:id", asyncHandler(MemberController.getByShakhaId));
router.get("/get", asyncHandler(MemberController.getAll));

router.use(authorize("admin"))
router.patch("/update/:id", validate(UpdateMemberSchema), asyncHandler(MemberController.updateMember));
router.post("/register", validate(RegisterMemberSchema), asyncHandler(MemberController.register));

export default router;
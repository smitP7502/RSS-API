import { Router } from "express";
import { RegisterMemberSchema, UpdateMemberSchema } from "../schema/member.schema";
import { authenticate } from "../../../middlewares/authenticate";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authorize } from "../../../middlewares/authorize";
import { validate } from "../../../middlewares/validate";
import { MemberController } from "../controller/member.controller";

const router = Router()

router.use(authenticate)
router.get("/get/me", asyncHandler(MemberController.getMemberData));
router.patch("/get/me", validate(UpdateMemberSchema), asyncHandler(MemberController.updateMemberData));
router.get("/get/:id", asyncHandler(MemberController.getByShakhaId));
router.get("/get", asyncHandler(MemberController.getAll));


router.use(authorize("ADMIN"))
router.patch("/update/:id", validate(UpdateMemberSchema), asyncHandler(MemberController.updateMember));
router.post("/register", validate(RegisterMemberSchema), asyncHandler(MemberController.register));
router.delete("/:id/delete", asyncHandler(MemberController.deleteMember));

export default router;
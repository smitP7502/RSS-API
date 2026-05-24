import { Router } from "express";
import { CreateRegisterMemberShakaSchema, RegisterMemberSchema, UpdateMemberSchema } from "../schema/member.schema";
import { authenticate } from "../../../middlewares/authenticate";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authorize } from "../../../middlewares/authorize";
import { validate } from "../../../middlewares/validate";
import { MemberController } from "../controller/member.controller";
import { checkPermission } from "../../../middlewares/check_permission";
import { getMemberAndShakahId } from "../../../middlewares/get_shakhaId";

const router = Router()

router.use(authenticate)
router.get("/get/me", asyncHandler(MemberController.getMemberData));
router.patch("/update/:id", checkPermission("canEditMember"), validate(UpdateMemberSchema), asyncHandler(MemberController.updateMemberData));
router.get("/get/:id", asyncHandler(MemberController.getByShakhaId));
router.get("/get", asyncHandler(MemberController.getAll));

// mobile
// router.post("/createRegisterMemberShaka", checkPermission("canAddMember"), validate(CreateRegisterMemberShakaSchema), getMemberAndShakahId, asyncHandler(MemberController.createRegisterMemberShaka));


// router.use(authorize("ADMIN"))
router.patch("/update/:id", validate(UpdateMemberSchema), asyncHandler(MemberController.updateMember));
router.post("/register", checkPermission("canAddMember"), validate(RegisterMemberSchema), asyncHandler(MemberController.register));
router.delete("/delete/:id", checkPermission("canAddMember"), asyncHandler(MemberController.deleteMember));



export default router;
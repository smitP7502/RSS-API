import { Router } from "express";
import { validate } from "../../../middlewares/validate";
import { CreateMemberRoleSchema } from "../schema/memberRole.shcema";
import { asyncHandler } from "../../../lib/asyncHandler";
import { MemberRoleController } from "../controller/memberRole.controller";
import { authenticate } from "../../../middlewares/authenticate";
import { UpdateMemberSchema } from "../../member/schema/member.schema";
import { authorize } from "../../../middlewares/authorize";

const router = Router()

router.use(authenticate);
router.get("/get/:id", asyncHandler(MemberRoleController.getById));
router.get("/get", asyncHandler(MemberRoleController.getAll));

router.use(authorize("ADMIN"));
router.post("/add", validate(CreateMemberRoleSchema), asyncHandler(MemberRoleController.add));
router.patch("/update/:id", validate(UpdateMemberSchema), asyncHandler(MemberRoleController.update));
router.delete("/delete/:id", asyncHandler(MemberRoleController.delete));

export default router;
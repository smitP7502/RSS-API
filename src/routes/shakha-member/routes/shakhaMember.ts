import { Router } from "express";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authenticate } from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/authorize";
import { ShakhaMemberController } from "../controller/shakhaMember.controller";
import { validate } from "../../../middlewares/validate";
import { AssignMemberRoleSchema } from "../schema/shakhaMember.schema";

const router = Router();

router.use(authenticate)
router.get("/:id", asyncHandler(ShakhaMemberController.getShakhaMembers));
// router.get("/get/:id", asyncHandler(ShakhaMemberController.getByID));
// router.get("/get", asyncHandler(ShakhaMemberController.getAll));

router.use(authorize("ADMIN"))
router.post("/:id/roles", validate(AssignMemberRoleSchema), asyncHandler(ShakhaMemberController.assingRole));
router.delete("/:id/roles/:shakahMemberId", asyncHandler(ShakhaMemberController.revokeRole));
// router.post("/add", asyncHandler(ShakhaMemberController.add));
// router.post("/update/:id", asyncHandler(ShakhaMemberController.update));
// router.delete("/delete/:id", asyncHandler(ShakhaMemberController.delete));

export default router;
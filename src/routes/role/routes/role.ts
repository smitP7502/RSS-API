import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/authorize";
import { asyncHandler } from "../../../lib/asyncHandler";
import { validate } from "../../../middlewares/validate";
import { AddRoleSchema } from "../schema/role.schema";
import { RoleController } from "../controllers/role.controller";

const router = Router();

router.use(authenticate);
router.get("/get", asyncHandler(RoleController.getAll));
router.get("/get/:id", asyncHandler(RoleController.getById));

router.use(authorize("admin"));
router.post("/add", validate(AddRoleSchema), asyncHandler(RoleController.add));
router.patch("/update/:id", validate(AddRoleSchema), asyncHandler(RoleController.update));
router.delete("/delete/:id", asyncHandler(RoleController.delete)
);

export default router;
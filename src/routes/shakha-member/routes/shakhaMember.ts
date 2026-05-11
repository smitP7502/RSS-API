import { Router } from "express";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authenticate } from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/authorize";
import { ShakhaMemberController } from "../controller/shakhaMember.controller";

const router = Router();

router.use(authenticate)
router.get("/get/:id", asyncHandler(ShakhaMemberController.getByID));
router.get("/get", asyncHandler(ShakhaMemberController.getAll));

router.use(authorize("admin"))
router.post("/add", asyncHandler(ShakhaMemberController.add));
router.post("/update/:id", asyncHandler(ShakhaMemberController.update));
router.delete("/delete/:id", asyncHandler(ShakhaMemberController.delete));

export default router;
import { Router } from "express";
import { CreateShakhaSchema, UpdateShakhaSchema } from "../shcema/shakha.schema";
import { ShakhaController } from "../controllers/shakha.controller";
import { asyncHandler } from "../../../lib/asyncHandler";
import { authenticate } from "../../../middlewares/authenticate";
import { authorize } from "../../../middlewares/authorize";
import { validate } from "../../../middlewares/validate";

const router = Router();

router.use(authenticate);
router.get("/get/:id", asyncHandler(ShakhaController.get));
router.get("/get", asyncHandler(ShakhaController.getAll));

router.use(authorize("admin"));
router.post("/add", validate(CreateShakhaSchema), asyncHandler(ShakhaController.create));
router.patch("/update/:id", validate(UpdateShakhaSchema), asyncHandler(ShakhaController.update));
router.delete("/delete/:id", asyncHandler(ShakhaController.delete));

export default router;
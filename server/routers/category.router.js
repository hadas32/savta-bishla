import { Router } from "express";
import { addCategory, allCategories, deleteCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";

const router=Router();

router.get('/',allCategories);
router.post('/',auth,authorizeRoles("admin"),upload.single("image"),addCategory);
router.get('/:id', getCategoryById);
router.put('/:id', auth, authorizeRoles("admin"), upload.single('image'), updateCategory);
router.delete('/:id',auth,authorizeRoles("admin"),deleteCategory);

export default router;
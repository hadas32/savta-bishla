import { Router } from "express";
import { addRecipe, deleteRecipe, getAllRecipes, getRecipeById, getRecipesByCategory, searchRecipes, updateRecipe } from "../controllers/recipe.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";

const router = Router();

router.get("/search", searchRecipes); 
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

router.post('/',auth,authorizeRoles("admin"), upload.single("image"), addRecipe);

router.put('/:id',auth,authorizeRoles("admin"),upload.single("image"), updateRecipe);
router.delete('/:id',auth,authorizeRoles("admin"),deleteRecipe);
router.get("/category/:id", getRecipesByCategory);



export default router;
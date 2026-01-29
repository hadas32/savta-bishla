import { Router } from "express";
import { addFavorite, deleteFavorite, deleteUser, getAllUsers, getFavorites, getUserById, login, register, updateUser } from "../controllers/user.controller.js";
import { validateJoiSchema } from "../middlewares/validate.middleware.js";
import { validUser } from "../models/user.model.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";

const router=Router();

router.post('/login',validateJoiSchema(validUser.login), login);
router.post('/',validateJoiSchema(validUser.register), register);
router.get('/favorites', auth, authorizeRoles("admin","user"), getFavorites);


router.get('/',auth,authorizeRoles("admin"), getAllUsers);

router.get('/:id',auth,authorizeRoles("admin","user"),getUserById);
router.put('/:id',auth,authorizeRoles("user"),updateUser);
router.delete('/:id',auth,authorizeRoles("admin","user"),deleteUser);
router.post('/favorites/:recipeId', auth, authorizeRoles("user","admin"), addFavorite);
router.delete('/favorites/:recipeId', auth, authorizeRoles("user","admin"), deleteFavorite);



export default router;
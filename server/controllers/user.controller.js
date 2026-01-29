import recipe from '../models/recipe.model.js';
import user, { generateToken } from '../models/user.model.js'
import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs";


export const register = async (req, res, next) => {
    try {
        const newUser = new user(req.body);
        await newUser.save();
        const token = generateToken(newUser);
        return res.status(201).json({ username: newUser.username, token: token });
    } catch (error) {
        next({ msg: error.message });
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const myUser = await user.findOne({ email })
        if (!myUser) {
            return next({ msg: 'login failed', type: 'not found', status: 404 });
        }
        const result = await bcrypt.compare(password, myUser.password);
        if (result) {
            const token = generateToken(myUser);
            return res.status(200).json({ username: myUser.username, token: token });
        }
        else {
            return next({ msg: 'login failed, The password is incorrect', type: 'not found', status: 401 });
        }
    } catch (error) {
        return next({ msg: 'login failed', type: 'not found', status: 404 });
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
export const getUserById = async (req, res, next) => {
    try {
        const id = req.user._id;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `user not found` } })
        }
        const userById = await user.findById(id);
        if (!userById)
            return res.status(404).json({ error: { message: `user not found` } })
        res.json(userById);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const id = req.user._id;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `product not found` } })
        }
        const userToUpdate = await user.findByIdAndUpdate(id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        });
        if (!userToUpdate)
            return res.status(404).json({ error: { message: `user not found` } })
        else
            res.json(userToUpdate);

    } catch (error) {
        res.status(400).json({ error: { message: 'data is invalid' } });
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const id = req.user._id;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `user not found` } })
        }
        const userToDelete = await user.findByIdAndDelete(id);
        if (!userToDelete)
            res.status(404).json({ error: { message: 'user not found' } });
        else
            res.status(204).end();
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getFavorites = async (req, res, next) => {
    try {
        const id = req.user._id;
        const myUser = await user.findById(id).populate("favorites");
        
        if (!myUser)
            return res.status(404).json({ error: { message: "user not found" } });


        res.json(myUser.favorites); 
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};

export const addFavorite = async (req, res, next) => {
    try {
        const id = req.user._id;
        const { recipeId } = req.params;
        if (!isValidObjectId(id) || !isValidObjectId(recipeId)) {
            return res.status(404).json({ error: { message: `product not found` } })
        }
        const myUser = await user.findById(id);
        if (!myUser)
            return res.status(404).json({ error: { message: `user not found` } })
        const myRecipe = await recipe.findById(recipeId);
        if (!myRecipe)
            return res.status(404).json({ error: { message: `recipe not found` } })
        if (!myUser.favorites.includes(recipeId)) {
            myUser.favorites.push(recipeId);
            await myUser.save();
        }
        res.json(myUser);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}

export const deleteFavorite = async (req, res, next) => {
    try {
        const id = req.user._id;
        const { recipeId } = req.params;
        if (!isValidObjectId(id) || !isValidObjectId(recipeId)) {
            return res.status(404).json({ error: { message: `product not found` } })
        }
        const myUser = await user.findById(id);
        if (!myUser)
            return res.status(404).json({ error: { message: `user not found` } })
        const myRecipe = await recipe.findById(recipeId);
        if (!myRecipe)
            return res.status(404).json({ error: { message: `recipe not found` } })
        if (myUser.favorites.includes(recipeId)) {
            myUser.favorites.pull(recipeId);
            await myUser.save();
        }
        res.json(myUser);
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
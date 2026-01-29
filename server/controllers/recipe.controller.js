import recipe from '../models/recipe.model.js';
import { isValidObjectId } from "mongoose";
import user from '../models/user.model.js';

export const getAllRecipes = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const filter = {};

    // 1. סינון לפי חיפוש טקסטואלי
    if (req.query.search && req.query.search.trim() !== "") {
        filter.title = { $regex: req.query.search, $options: "i" };
    }

    // 2. סינון לפי קטגוריה
    if (req.query.category && isValidObjectId(req.query.category)) {
        filter.categories = req.query.category;
    }
    
    // 3. הוספה: סינון לפי רמת קושי
    if (req.query.difficulty && req.query.difficulty.trim() !== "") {
        filter.difficulty = req.query.difficulty;
    }

    try {
        const recipes = await recipe.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .select("title description image");

        const total = await recipe.countDocuments(filter);

        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            recipes
        });
    }
    catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}

export const getRecipeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `recipe not found` } })
        }
        const recipeById = await recipe.findById(id).populate("categories");
        if (!recipeById) {
            return res.status(404).json({ error: { message: `recipe not found` } })
        }
        res.json(recipeById);
    }
    catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}
export const addRecipe = async (req, res, next) => {
    try {
        const { title, description, ingredients, instructions, time, difficulty, categories } = req.body;

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newRecipe = new recipe({
            title,
            description,
            ingredients: ingredients
                ? (Array.isArray(ingredients) ? ingredients : ingredients.split(","))
                : [],
            instructions: instructions
                ? (Array.isArray(instructions) ? instructions : instructions.split(",")) : [],
            time,
            difficulty,
            categories: Array.isArray(categories) ? categories : [categories], 
            image: imagePath
        });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    }
    catch (error) {
        console.log(" Error in addRecipe:", error);
        next({ status: 400, msg: "data is invalid" });
    }
}
export const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `recipe not found` } })
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        if (updateData.categories) {
            updateData.categories = Array.isArray(updateData.categories)
                ? updateData.categories
                : [updateData.categories];
        }

        if (updateData.instructions) {
            updateData.instructions = Array.isArray(updateData.instructions)
                ? updateData.instructions
                : updateData.instructions.split(",");
        }

        if (updateData.ingredients) {
            updateData.ingredients = Array.isArray(updateData.ingredients)
                ? updateData.ingredients
                : updateData.ingredients.split(",");
        }

        const myRecipe = await recipe.findByIdAndUpdate(id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!myRecipe)
            return res.status(404).json({ error: { message: 'recipe not found' } });
        else
            res.json(myRecipe);
    }
    catch (error) {
        next({ status: 400, msg: "data is invalid" });
    }

}
export const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `recipe not found` } })
        }
        const deleteRecipe = await recipe.findByIdAndDelete(id);
        if (!deleteRecipe) {
            res.status(404).json({ error: { message: 'recipe not found' } });
        }
        else
            res.status(204).end();
    }
    catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}

// פונקציה לקבלת מתכונים לפי קטגוריה
export const getRecipesByCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: "category not found" } });
        }

        const recipes = await recipe.find({ categories: id }).populate("categories");
        res.json(recipes);

    } catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}

export const searchRecipes = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === "") {
            return res.json([]); 
        }

        const recipes = await recipe.find({
            title: { $regex: query, $options: "i" } 
        }).limit(20);

        res.json(recipes);
    } catch (error) {
        next({ status: 500, msg: "Search failed" });
    }
};
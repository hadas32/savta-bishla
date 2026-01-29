import category from "../models/category.model.js";
import { isValidObjectId } from "mongoose";

export const allCategories = async (req, res, next) => {
    try {
        const categories = await category.find();
        res.json(categories);
    } catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}

export const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `category not found` } })
        }
        const categoryById = await category.findById(id);
        if (!categoryById) {
            return res.status(404).json({ error: { message: `category not found` } })
        }
        res.json(categoryById);

    } catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }

}

export const addCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const newCategory = new category({
            name,
            description,
            image: imagePath
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        next({ status: 400, msg: "data is invalid" });
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `category not found` } });
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const myCategory = await category.findByIdAndUpdate(id,
             { $set: updateData}, 
             {new: true,runValidators: true }
            );

        if (!myCategory)
            return res.status(404).json({ error: { message: `category not found`} });
        else
            res.json(myCategory);
    }
    catch (error) {
        next({ status: 400, msg: "data is invalid" });
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).json({ error: { message: `category not found` } })
        }
        const deleteCategory = await category.findByIdAndDelete(id);
        if (!deleteCategory) {
            res.status(404).json({ error: { message: `category not found` } });
        }
        else
            res.status(204).end();
    }
    catch (error) {
        next({ status: 500, msg: "data is invalid" });
    }
}
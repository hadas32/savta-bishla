import { model,Schema } from "mongoose";

const recipeSchema=new Schema({
     
title: String,
description: String,
ingredients: [String],   
instructions: [String],  
time:Number,
difficulty:String,
categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }], 
image:String,
createdAt: {
    type: Date,
    default: Date.now   
  }});
const recipe = model('recipes', recipeSchema);
export default recipe;
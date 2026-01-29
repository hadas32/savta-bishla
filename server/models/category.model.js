import { model, Schema } from "mongoose";

const categorySchema = new Schema({
      name: { type: String, required: true, unique: true },
      description: String,
      image:String
});
const category = model('categories', categorySchema);
export default category;
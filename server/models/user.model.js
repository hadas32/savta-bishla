import { model, Schema } from "mongoose";
import { type } from "os";
import Joi from 'joi';
import bcrypt from "bcryptjs";
import { register } from "module";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username:{type: String, trim: true} ,
    email: {type: String,required: true, unique: true, lowercase: true},
    password: {type: String,required: true},
    role: {type: String, enum:['admin','user'], default:'user'},
    favorites: [{ type: Schema.Types.ObjectId, ref: "recipes" }],
});


//הצפנת סיסמא לפני שמירת המשתמש
userSchema.pre('save',async function(){
    if (!this.isModified('password')) return; 
    const salt = await bcrypt.genSalt(12)
    const hash =await bcrypt.hash(this.password,salt);
    this.password=hash;
})

export const validUser={
    login: Joi.object({
        email: Joi.string().required().lowercase(),
        password: Joi.string().required().min(8)
    }),
    register: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8),
        password2: Joi.ref('password'), 
        email: Joi.string().email().lowercase()
    })
}

export const generateToken=(user)=>{
    const payload={_id: user._id, role: user.role};
    const token=jwt.sign(payload,process.env.JWT_SECRET)
    return token;
}
const user = model('users', userSchema);
export default user;
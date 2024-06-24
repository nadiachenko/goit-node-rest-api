import { Schema, model } from "mongoose";
import { handleError, preUpdate } from "../models/hooks.js";
import Joi from "joi";


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new Schema({

  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailRegex,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,

}, { versionKey: false })

userSchema.post("save", handleError)
userSchema.pre("findOneAndUpdate", preUpdate)
userSchema.post("findOneAndUpdate", handleError)

export const userSignupSchema = Joi.object({

  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required()

})

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required()

})

const User = model("user", userSchema);

export default User;
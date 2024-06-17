import { Schema, model } from "mongoose";
import { handleError, preUpdate } from "../models/hooks.js";
import Joi from "joi";


const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }

}, { versionKey: false });

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required`,
    "string.base": `"name" should be a text`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" is required`,
    "string.base": `"email" should be a text`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is required`,
    "string.base": `"phone" should be a text`,
  }),
  favorite: Joi.boolean()
})
export const updateContactSchema = Joi.object({
  name: Joi.string().messages({
    "any.required": `"name" is required`,
    "string.base": `"name" should be a text`,
  }),
  email: Joi.string().messages({
    "any.required": `"email" is required`,
    "string.base": `"email" should be a text`,
  }),
  phone: Joi.string().messages({
    "any.required": `"phone" is required`,
    "string.base": `"phone" should be a text`,
  }),
  favorite: Joi.boolean()
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `"favorite" is required`,
    "string.base": `"favorite" should be true or false`,
  })
})

contactsSchema.post("save", handleError)
contactsSchema.pre("findOneAndUpdate", preUpdate)
contactsSchema.post("findOneAndUpdate", handleError)
const Contact = model("contact", contactsSchema);

export default Contact;
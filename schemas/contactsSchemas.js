import Joi from "joi";

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
    })
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
})
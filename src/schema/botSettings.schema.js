import Joi from "joi";


export const botSettingSchema = Joi.object({
    words: Joi.string()
        .trim()
        .required()
        .messages({
            "any.required": "Word list is required"
        }),
    
    domains: Joi.string() 
        .trim()
        .required()
        .messages({
            "any.required": "Domains is required",
        })
});
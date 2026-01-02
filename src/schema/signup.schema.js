import Joi from "joi";

export const signupSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .lowercase()
        .required()
        .messages({
            "string.email": "Must be a valid email address",
            "any.required": "Email is required",
        }),

    phone: Joi.string()
        .required()
        .messages({
            "string.pattern.base": "Phone must be a valid internation format",
            "any.required": "Phone Numbe is required"
        }),

    firstName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z\u00C0-\u017F\s\-']+$/)
        .messages({
            'string.min': 'First name must be at least 1 character',
            'string.max': 'First name cannot exceed 50 characters',
            'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z\u00C0-\u017F\s\-']+$/)
        .messages({
            'string.min': 'Last name must be at least 1 character',
            'string.max': 'Last name cannot exceed 50 characters',
            'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
            'any.required': 'Last name is required'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password cannot exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        }),

    role: Joi.string()
        .required()
        .valid("admin", "user")
        .messages({
            "any.required": "Role is required",
            "any.only": "Role should be either 'user' or 'admin'"
        })
});
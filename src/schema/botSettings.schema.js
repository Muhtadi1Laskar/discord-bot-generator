import Joi from "joi";

export const botRulesSchema = Joi.object({
    guildId: Joi.string()
        .pattern(/^\d{10,20}$/) // Discord IDs are 17-20 digit snowflakes
        .required()
        .messages({
            'string.pattern.base': 'guildId must be a valid Discord server ID (17-20 digits)',
            'any.required': 'guildId is required'
        }),

    topic: Joi.string()
        .required()
        .messages({
            'any.required': 'topic is required'
        }),

    rules: Joi.object({
        bannedWords: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .min(1)
                    .max(100)
                    .replace(/\s+/g, ' ') // Normalize whitespace
                    .custom((value, helpers) => {
                        // Prevent empty strings after trimming
                        if (value.trim() === '') {
                            return helpers.error('string.empty');
                        }
                        return value.toLowerCase(); // Normalize to lowercase
                    })
            )
            .unique()
            .min(0)
            .max(100)
            .default([])
            .messages({
                'array.unique': 'Duplicate banned words are not allowed',
                'array.max': 'Maximum 100 banned words allowed'
            }),

        bannedDomains: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .min(1)
                    .max(253) // Max domain length
                    .lowercase()
                    .pattern(/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/)
                    .custom((value, helpers) => {
                        // Handle wildcards like *.xyz
                        if (value.startsWith('*.') && value.length > 2) {
                            const domainPart = value.slice(2);
                            if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(domainPart)) {
                                return helpers.error('string.pattern.base');
                            }
                            return value;
                        }
                        return value;
                    })
            )
            .unique()
            .min(0)
            .max(50)
            .default([])
            .messages({
                'array.unique': 'Duplicate banned domains are not allowed',
                'string.pattern.base': 'Invalid domain format (e.g., example.com or *.xyz)',
                'array.max': 'Maximum 50 banned domains allowed'
            }),

        actions: Joi.object({
            delete: Joi.boolean().default(true),
            warnUser: Joi.boolean().default(true)
        })
            .default({ delete: true, warnUser: true })
    })
        .required(),
        
    useLLM: Joi.boolean()
        .required()
        .messages({
            "any.required": "useLLM is required"
        })
});
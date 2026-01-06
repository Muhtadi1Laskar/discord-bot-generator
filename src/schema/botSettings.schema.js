import Joi from 'joi';

// Reusable action schema
const actionSchema = Joi.object({
    delete: Joi.boolean().default(false),
    warn: Joi.boolean().default(false),
    mute: Joi.boolean().default(false)
}).default({ delete: false, warn: false, mute: false });

// Banned Words Schema
const bannedWordsSchema = Joi.object({
    words: Joi.array().items(
        Joi.string()
            .trim()
            .min(1)
            .max(100)
            .custom((value, helpers) => {
                if (value.trim() === '') {
                    return helpers.error('string.empty');
                }
                return value;
            })
    )
        .required()
        .default([]),
    actions: actionSchema
}).default({ words: [], actions: { delete: false, warn: false, mute: false } });

// Banned Domains Schema
const bannedDomainsSchema = Joi.object({
    domains: Joi.array().items(
        Joi.string()
            .trim()
            .min(1)
            .max(253)
            .lowercase()
            .pattern(/^(?:\*\.)?[a-z0-9][a-z0-9.-]*[a-z0-9]$/)
    )
        .optional()
        .default([]),
    actions: actionSchema
}).default({ domains: [], actions: { delete: false, warn: false, mute: false } });

// Spam Detection Schema
const spamSchema = Joi.object({
    maxRepeats: Joi.number()
        .integer()
        .min(4)
        .max(10)
        .default(5),
    actions: actionSchema
}).default({ maxRepeats: 5, actions: { delete: false, warn: false, mute: false } });

// Aggression Detection Schema
const aggressionSchema = Joi.object({
    maxCapsRatio: Joi.number()
        .min(0)
        .max(1)
        .precision(2)
        .default(0.0),
    actions: actionSchema
}).default({ maxCapsRatio: 0.0, actions: { delete: false, warn: false, mute: false } });

// Main Rules Schema
const rulesSchema = Joi.object({
    bannedWords: bannedWordsSchema,
    bannedDomains: bannedDomainsSchema,
    spamDetection: spamSchema,
    aggressionDetection: aggressionSchema,
    allowLinks: Joi.boolean().default(true),
    allowPings: Joi.boolean().default(true)
}).default({
    bannedWords: { words: [], actions: { delete: false, warn: false, mute: false } },
    bannedDomains: { domains: [], actions: { delete: false, warn: false, mute: false } },
    spamDetection: { maxRepeats: 5, actions: { delete: false, warn: false, mute: false } },
    aggressionDetection: { maxCapsRatio: 0.0, actions: { delete: false, warn: false, mute: false } },
    allowLinks: true,
    allowPings: true
});

// Full Bot Settings Schema
export const botSettingsSchema = Joi.object({
    userId: Joi.string().optional(), // Keep as string if not using ObjectId
    guildId: Joi.string()
        .pattern(/^\d{17,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'guildId must be a valid Discord server ID (17-20 digits)',
            'any.required': 'guildId is required'
        }),
    topic: Joi.string()
        .max(100)
        .optional()
        .default(''),
    rules: rulesSchema,
    useLLM: Joi.boolean().default(false)
}).messages({
    'object.unknown': 'Unexpected field in request body'
});
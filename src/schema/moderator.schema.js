import Joi from 'joi';

const moderateMessageSchema = Joi.object({
    guildId: Joi.string()
        .pattern(/^\d{17,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'guildId must be a valid Discord server ID (17-20 digits)',
            'any.required': 'guildId is required'
        }),

    authorId: Joi.string()
        .pattern(/^\d{17,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'authorId must be a valid Discord user ID (17-20 digits)',
            'any.required': 'authorId is required'
        }),

    authorName: Joi.string()
        .max(32) // Discord's globalName limit
        .allow(null, '') // Can be null if user has no global name
        .messages({
            'string.max': 'authorName must be at most 32 characters'
        }),

    messageContent: Joi.string()
        .max(2000) // Discord's message limit
        .required()
        .messages({
            'string.max': 'messageContent exceeds Discord\'s 2000-character limit',
            'any.required': 'messageContent is required'
        }),
    
    messageId: Joi.string()
        .pattern(/^\d{10,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'messageId must be a valid Discord message ID (17-20 digits)',
            'any.required': 'messageId is required'
        }),
}).messages({
    'object.unknown': 'Unexpected field in request body'
});

export default moderateMessageSchema;
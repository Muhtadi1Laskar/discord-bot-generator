import mongoose, { mongo, Mongoose } from "mongoose";

const rulesActionSchema = new mongoose.Schema({
    delete: { type: Boolean, default: false },
    warn: { type: Boolean, default: false },
    mute: { type: Boolean, default: false }
}, { _id: false });

const bannedWordsSchema = new mongoose.Schema({
    words: {
        type: [String],
        required: true,
        default: [],
        validate: {
            validator: (arr) => {
                return arr.every(word => typeof word === "string" && word.trim().length > 0);
            },
            message: "All bannedWords must be non-empty strings"
        },
    },
    actions: rulesActionSchema
}, { _id: false });

const bannedLinksSchema = new mongoose.Schema({
    doomains: {
        type: [String],
        required: false,
        default: [],
        validate: {
            validator: (arr) => {
                return arr.every(domain => {
                    const clean = domain.trim().toLowerCase();
                    return /^(?:\*\.)?[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(clean);
                });
            },
            message: 'Invalid domain format in bannedDomains'
        },
    },
    actions: rulesActionSchema
}, { _id: false });

const spamSchema = new mongoose.Schema({
    maxRepeats: {
        type: Number,
        default: 5,
        min: 4,
        max: 10
    },
    actions: rulesActionSchema
}, { _id: false });

const aggressionDetectionSchema = new mongoose.Schema({
    maxCapsRatio: {
        type: Number,
        default: 0.0
    },
    actions: rulesActionSchema
}, { _id: false });

const moderationRulesSchema = new mongoose.Schema({
    bannedWords: bannedWordsSchema,
    bannedDomains: bannedLinksSchema,
    spamDetection: spamSchema,
    aggressionDetection: aggressionDetectionSchema,
    allowLinks: { type: Boolean, default: true },
    allowPings: { type: Boolean, default: true }
});

const moderatorSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false
    },
    guildId: {
        type: String,
        required: true,
        match: [/^\d{10,20}$/, 'Invalid Discord guild ID']
    },
    topic: {
        type: String,
        required: false,
        default: ''
    },
    rules: moderationRulesSchema,
    useLLM: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const BotSettingModel = mongoose.model("ModeratorSettings", moderatorSchema);

export default BotSettingModel;
import mongoose from "mongoose";

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
    bannedWords: {
        type: [String],
        required: true,
        default: [],
        validate: {
            validator: function (arr) {
                return arr.every(word => typeof word === "string" && word.trim().length > 0);
            },
            message: "All bannedWords must be non-empty strings"
        }
    },
    bannedDomains: {
        type: [String],
        required: false,
        default: [],
        validate: {
            validator: function (arr) {
                return arr.every(domain => {
                    const clean = domain.trim().toLowerCase();
                    return /^(?:\*\.)?[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(clean);
                });
            },
            message: 'Invalid domain format in bannedDomains'
        }
    },
    actions: {
        delete: {
            type: Boolean
        },
        warnUser: {
            type: Boolean
        }
    }
}, {
    timestamps: true
});

const BotSettingModel = mongoose.model("ModeratorSettings", moderatorSchema);

export default BotSettingModel;
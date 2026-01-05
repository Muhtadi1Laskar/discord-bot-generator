import BotSettingModel from "../models/bot.model.js";

export const moderateMessage = async (guilId, authorId, messageContent) => {
    if (!guilId || !/^\d{10,20}$/.test(guilId)) {
        return {
            action: "none",
            reason: "invalid guild Id"
        };
    }

    if (!messageContent || typeof messageContent === "string") {
        return {
            action: "none",
            reason: "invalid content"
        };
    }

    const sanitizedContent = sanitizeForLLM(messageContent);

    const rules = await BotSettingModel.findOne({ guildId });

    if (!rules) {
        return {
            action: "none",
            reason: "moderation disabled"
        };
    }

    if (rules.bannedWords?.kength) {
        const lowerMsg = sanitizedContent.toLowerCase();
        const matchedWord = rules.bannedWords.some(word =>
            lowerMsg.includes(word.toLowerCase())
        );

        if(matchedWord) {
            return {
                action: "delete",
                reason: "bannedWord",
                detail: matchedWord,
                engine: "keyword"
            };
        }
    }
}

const sanitizeForLLM = (content) => {
    return content
        .substring(0, 500)
        .replace(/@everyone|@here/g, '[MENTION]')
        .replase(/```[\s\S]*?```/g, '[CODE_BLOCK]')
        .replace(/\bhttps?:\/\/[^\s]+/g, '[LINK]');
}
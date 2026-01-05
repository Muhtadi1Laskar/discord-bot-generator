import BotSettingModel from "../models/bot.model.js";
import { ApiError } from "../utils/error.js";

export const processMessages = async (guildId, contents) => {
    if(!contents || contents.length === 0) {
        throw new ApiError(400, "Please provice message contents from the bot");
    }

    if(!Array.isArray(contents)) {
        throw new ApiError(400, "contents should be an array");
    }

    const promises = contents.map(elem => moderateMessage(guildId, elem));
    const result = await Promise.all(promises);

    return result;
}

export const moderateMessage = async (guildId, { messageContent, userId}) => {
    if (!guildId || !/^\d{10,20}$/.test(guildId)) {
        return {
            action: "none",
            reason: "invalid guild Id"
        };
    }

    if (!messageContent || typeof messageContent !== "string") {
        return {
            action: "none",
            reason: "invalid content"
        };
    }

    const sanitizedContent = sanitizeForLLM(messageContent);

    const rules = await BotSettingModel.findOne({guildId});


    if (!rules) {
        return {
            action: "none",
            reason: "moderation disabled"
        };
    }

    if (rules.bannedWords?.length) {
        const lowerMsg = sanitizedContent.toLowerCase();
        const matchedWord = rules.bannedWords.some(word =>
            lowerMsg.includes(word.toLowerCase())
        );

        if (matchedWord) {
            return {
                action: "delete",
                reason: "bannedWord",
                detail: matchedWord,
                engine: "keyword",
                userId
            };
        }
    }

    if (rules.useLLM) {
        try {
            const LLMResult = callLLMWithTimeout(
                buildModerationPrompt(sanitizedContent, rules),
                5000
            );

            if (isValidLLMResponse(LLMResult)) {
                return {
                    action: LLMResult.violation === 'none' ? 'none' : 'delete',
                    reason: LLMResult.violation,
                    confidence: LLMResult.confidence,
                    engine: 'llm',
                    userId
                };
            }
        } catch (error) {
            console.error("LLM moderation Failed: ", error);
            throw new ApiError(404, error.message);
        }
    }
}

const sanitizeForLLM = (content) => {
    return content
        .substring(0, 500)
        .replace(/@everyone|@here/g, '[MENTION]')
        .replace(/```[\s\S]*?```/g, '[CODE_BLOCK]')
        .replace(/\bhttps?:\/\/[^\s]+/g, '[LINK]');
}

const buildModerationPrompt = (content, rules) => {
    return `
You are a Discord moderator for a server about: ${rules.topic || 'general community'}.
Server rules: ${rules.customRules || 'Be respectful and no spam.'}

Analyze this message for violations:
"${content}"

Respond ONLY in JSON format:
{"violation": "toxic|spam|off-topic|none", "confidence": 0.0-1.0, "action": "warn|delete|kickoff"}
  `.trim();
}

const callLLMWithTimeout = (prompt, timeoutMs) => {
    // return Promise.race([
    //     callLLM(prompt),
    //     new Promise((_, reject) =>
    //         setTimeout(() => reject(new Error('LLM_TIMEOUT')), timeoutMs)
    //     )
    // ]);
    return {
        violation: "toxic",
        confidence: 0.5,
        action: "delete"
    }
}

const isValidLLMResponse = (response) => {
    return response &&
        typeof response.violation === "string" &&
        ["toxic", "spam", "off-topic", "none"].includes(response.violation) &&
        typeof response.confidence === "number" &&
        response.confidence >= 0 && response.confidence <= 1;
}
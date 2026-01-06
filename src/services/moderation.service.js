import BotSettingModel from "../models/bot.model.js";
import { ApiError } from "../utils/error.js";
import { calculateCapitalRatio, checkLinks, checkRepetitions, detectGlobalPing } from "../utils/moderationOps.js";

export const processMessages = async (guildId, contents) => {
    if (!contents || contents.length === 0) {
        throw new ApiError(400, "Please provice message contents from the bot");
    }

    if (!Array.isArray(contents)) {
        throw new ApiError(400, "contents should be an array");
    }

    const promises = contents.map(elem => moderateMessage(guildId, elem));
    const result = await Promise.all(promises);

    return result;
}

export const moderateMessage = async ({ guildId, messageContent, authorId, authorName, messageId }) => {
    if (!messageContent || typeof messageContent !== "string") {
        return {
            action: "none",
            reason: "invalid content"
        };
    }

    const sanitizedContent = sanitizeForLLM(messageContent);
    const { rules } = await BotSettingModel.findOne({ guildId });

    if (Object.keys(rules).length === 0) {
        return {
            action: "none",
            reason: "moderation disabled"
        };
    }

    const rulesToApply = applyRules(rules, sanitizedContent);
    const result = {
        engine: "keyword",
        authorId,
        authorName,
        messageId,
        rulesToApply
    };

    if (rulesToApply.length > 0) {
        return result
    }

    if (rules.useLLM) {
        try {
            const LLMResult = callLLMWithTimeout(
                buildModerationPrompt(sanitizedContent, rules),
                5000
            );

            if (isValidLLMResponse(LLMResult)) {
                return {
                    action: LLMResult.violation,
                    reason: LLMResult.violation,
                    confidence: LLMResult.confidence,
                    engine: 'llm',
                    authorId,
                    authorName,
                    messageId
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
        // .substring(0, 500)
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
    return {
        violation: "toxic",
        confidence: 0.5,
        action: "warn"
    }
}

const isValidLLMResponse = (response) => {
    return response &&
        typeof response.violation === "string" &&
        ["toxic", "spam", "off-topic", "none"].includes(response.violation) &&
        typeof response.confidence === "number" &&
        response.confidence >= 0 && response.confidence <= 1;
}

const applyRules = (rules, textContent) => {
    const bannedWords = rules.bannedWords || [];
    const spamDetection = rules.spamDetection;
    const allowLinks = rules.allowLinks;
    const allowPings = rules.allowPings;

    const rulesToApply = [];

    if (bannedWords || bannedWords.words.length > 0) {
        const matchedWords = bannedWords.words.some(word =>
            textContent.includes(word)
        );
        if (matchedWords) {
            rulesToApply.push({
                reason: "bannedWords",
                detail: matchedWords,
                confidence: 1,
                engine: "keyword",
                rulesToApply: bannedWords?.actions || {},
            });
        }
    }

    if (spamDetection) {
        if (checkRepetitions(textContent, spamDetection.maxRepeats)) {
            rulesToApply.push({
                reason: "spamDetection",
                detail: "",
                confidence: 1,
                engine: "keyword",
                rulesToApply: spamDetection?.actions || {}
            });
        }
    }

    if (!allowLinks && checkLinks(textContent)) {
        rulesToApply.push({
            reason: "linksDetected",
            detail: "Malacious link is detected",
            confidence: 1,
            engine: "keyword",
            rulesToApply: { delete: true }
        });
    }

    if (!allowPings && detectGlobalPing(textContent)) {
        rulesToApply.push({
            reason: "pingDetected",
            detail: "Global ping is not allowed",
            confidence: 1,
            engine: "keyword",
            rulesToApply: { delete: true }
        });
    }


    return rulesToApply;
}
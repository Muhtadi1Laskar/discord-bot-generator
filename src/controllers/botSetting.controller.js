import { setBotSettings } from "../services/botSettings.service.js";
import { successResponse } from "../utils/response.js";

export const botSettingController = async (req, res, next) => {
    const { guildId, topic, rules, useLLM } = req.body;
    const userId = req.userId;

    const flatenedData = {
        userId,
        guildId,
        topic,
        rules,
        useLLM
    };

    try {
        const savedSettings = await setBotSettings(flatenedData);
        successResponse(res, { savedSettings }, 201);
    } catch (error) {
        next(error);
    }
}
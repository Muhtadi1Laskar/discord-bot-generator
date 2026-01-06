import BotSettingModel from "../models/bot.model.js";
import { ApiError } from "../utils/error.js";

export const createGuild = async (userId, guildId) => {
    const existingGuild = await BotSettingModel.findOne({ userId, guildId });

    if (existingGuild) {
        throw new ApiError(409, "A guild with this ID already exists. Please use the update endpoint to edit it");
    }

    await BotSettingModel.create({
        userId,
        guildId,
        topic: '',
        rules: {},
        useLLM: false
    });

    return {
        message: "Successfully added the bot and created the guild"
    }
}

export const setBotSettings = async ({ userId, guildId, topic, rules, useLLM }) => {
    const updatedData = {};

    if (topic) {
        updatedData.topic = topic;
    }

    if (useLLM) {
        updatedData.useLLM = useLLM;
    }

    if (rules) {
        updatedData.rules = rules;
    }

    const updatedBotSettings = await BotSettingModel.findOneAndUpdate(
        { userId, guildId },
        { $set: updatedData },
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    );

    if (!updatedBotSettings) {
        throw new ApiError(404, "Bot settings not found for this user and guild");
    }

    return {
        message: "Successfully added the settings to the bot"
    };
}
import BotSettingModel from "../models/bot.model.js"

export const getRules = async (guildId) => {
    const rules = await BotSettingModel.findOne({ guildId });

    if (!rules) {
        throw new Error("There is no rules saved with the given guildId");
    }

    return rules;
}
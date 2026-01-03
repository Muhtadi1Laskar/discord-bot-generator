import { successResponse } from "../utils/response.js";

export const botSettingController = async (req, res, next) => {
    const { words, domain } = req.body;

    const cleanWords = words.split(',').map(elem => elem.trim());
    const cleanDomain = domain.split(',').map(elem => elem.trim());

    try {
        const savedSettings = await setBotSettings(cleanWords, cleanDomain);
        successResponse(res, { savedSettings }, 201);
    } catch (error) {
        next(error);
    }
}
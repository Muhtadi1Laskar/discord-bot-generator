import { successResponse } from "../utils/response.js";

export const registerBotConroller = async (req, res, next) => {
    const authURL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=76800&scope=bot`;

    try {
        const body = {
            authURL
        };
        successResponse(res, body, 201);
    } catch (error) {
        next(error);
    }
}
import { errorResponse, successResponse } from "../utils/response.js";
import { createGuild } from "../services/botSettings.service.js";
import OauthState from "../models/oauthState.model.js";
import { v4 as uuidv4 } from "uuid";

export const registerBotConroller = async (req, res, next) => {
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    const userId = req.userId;
    const state = uuidv4();

    await OauthState.create({
        state,
        userId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const authURL = `https://discord.com/api/oauth2/authorize?` +
        `client_id=${process.env.CLIENT_ID}&` +
        `permissions=76800&` +
        `scope=bot&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;

    try {
        successResponse(res, { authURL }, 201);
    } catch (error) {
        next(error);
    }
}

export const discordCallbackController = async (req, res, next) => {
    try {
        const { guild_id, state } = req.query;

        if (!guild_id || !state) {
            return errorResponse(res, {
                message: "No server selected. Please choose a server when adding the bot"
            }, 400);
        }

        const oauthState = await OauthState.findOne({ state });

        if (!oauthState) {
            return errorResponse(res, { message: "Invalid or expired token" }, 400);
        }

        const userId = oauthState.userId;

        const createdGuild = await createGuild(userId, guild_id);
        successResponse(res, createdGuild, 201);
    } catch (error) {
        next(error);
    }
}
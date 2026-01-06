import { moderateMessage } from "../services/moderation.service.js";
import { successResponse } from "../utils/response.js";

export const moderatorController = async (req, res, next) => {
    try {
        const decision = await moderateMessage(req.body);
        successResponse(res, decision, 201);
    } catch (error) {
        next(error);
    }
}
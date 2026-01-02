import { activateUser } from "../service/activate.service.js";
import { signup } from "../service/signup.service.js";
import { successResponse } from "../utils/response.js";

export async function signupController(req, res, next) {
    try {
        const user = await signup(req.body);
        successResponse(res, user, 201);
    } catch (error) {
        next(error);
    }
}

export async function activateController(req, res, next) {
    try {
        const response = await activateUser(req.params.token);
        console.log(response);
        successResponse(res, { message: response }, 200);
    } catch (error) {
        next(error);
    }
}
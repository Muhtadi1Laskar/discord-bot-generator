import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';


export const verifyJWT = async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, { message: 'Unauthorize' }, 401)
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return errorResponse(res, { message: 'Invalid or expired token' }, 403)
        } else {
            console.error("Error verifying JWT: ", error);
            return errorResponse(res, { message: "Internal Server Error" }, 500);
        }
    }
}
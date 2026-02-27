import { verifyAccessToken } from "../utils/token.js";


const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, error: "No token found" });
        }
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: error?.message || "Unauthorized" });
    }

}

export default authMiddleware;

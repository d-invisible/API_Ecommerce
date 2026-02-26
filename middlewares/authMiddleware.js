import { verifyToken } from "../utils/token.js";


const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, error: "No token found" });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: "Unauthorized" });
    }

}

export default authMiddleware;

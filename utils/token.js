import jwt from "jsonwebtoken";

const generateToken = (userData) => {
    return jwt.sign({ id: userData._id, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const generateAccessToken = (userData) => {
    return jwt.sign({ id: userData._id, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '5m' });
}

const generateRefreshToken = (userData) => {
    return jwt.sign({ id: userData._id, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken, generateAccessToken, generateRefreshToken };



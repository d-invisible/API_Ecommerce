import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, generateToken } from "../utils/token.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'user already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // generate access and refresh  token
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // create new user
        const newUser = await User.create({ name, email, password: hashedPassword, address, phone, refreshToken });

        // store refresh token in cookie


        res.status(201).json({ success: true, data: newUser, accessToken });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, error: 'user not found' });
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: 'invalid password' });
        }

        // generate access and refresh  token
        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);

        existingUser.refreshToken = refreshToken;
        await User.save();

        res.status(200).json({ success: true, data: existingUser, accessToken });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export { registerUser, loginUser };
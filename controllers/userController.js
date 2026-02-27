import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, address, phone } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'user already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user (without tokens first)
        const newUser = await User.create({ name, email, password: hashedPassword, role, address, phone });

        // generate access and refresh token
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // Update user with refresh token
        newUser.refreshToken = refreshToken;
        await newUser.save();

        // store refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });



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
        await existingUser.save();

        // store refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, data: existingUser, accessToken });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        }
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: false });
        res.status(200).json({ success: true, message: 'user logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const refreshTokenHandler = async (req, res) => {
    try {
        const cookieRefreshToken = req.cookies.refreshToken;
        if (!cookieRefreshToken) {
            return res.status(401).json({ success: false, error: 'refresh token not found, login again' });
        }

        const decodedToken = verifyRefreshToken(cookieRefreshToken);
        const user = await User.findById(decodedToken.id);

        if (!user || user.refreshToken !== cookieRefreshToken) {
            return res.status(401).json({ success: false, error: 'invalid refresh token, login again' });
        }


        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, data: user, accessToken });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export { registerUser, loginUser, logoutUser, refreshTokenHandler };
import express from 'express';
import passport from 'passport';
import User from '../schema/userSchema.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const router = express.Router();

router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile'],
        session: false
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/frontend/login',
        session: false
    }), async (req, res) => {
        const profile = req.user;

        const user = await handleOAuthCallback(profile, 'googleId');

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


        res.json({
            message: "User logged in successfully",
            user,
            accessToken
        })

    });

export default router;


const handleOAuthCallback = async (profile, provider) => {
    // check for existing user
    let user = await User.findOne({ $or: [{ [provider]: profile.id }, { email: profile.emails[0].value }] });

    if (user) {
        if (!user[provider]) {
            user[provider] = profile.id;
            await user.save();
        }

    }
    else {
        user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
        })
        await user.save();
    }



    return user;
}




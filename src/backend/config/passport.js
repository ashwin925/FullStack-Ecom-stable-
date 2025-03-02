const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        user.token = token; // Store the token

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

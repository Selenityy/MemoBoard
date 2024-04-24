const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/userModel");

passport.use(
  new LocalStrategy(
    { usernameField: "identifier" },
    async (identifier, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier }],
        });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user, { message: "Logged in successfully" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SESSION_SECRET,
    },
    asyncHandler(async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const emailUser = await User.findOne({
            email: profile.emails[0].value,
          });
          // If no user if found by Google Id, check if the email exists
          if (emailUser) {
            // If a user with the email exists, link the google Id to the existing account
            emailUser.googleId = profile.id;
            await emailUser.save();
            return cb(null, emailUser);
          } else {
            // If no user exists with the same email, create a new user
            user = await new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
            });
            await user.save();
          }
        }

        return cb(null, user); // user found or created successfully
      } catch (err) {
        return cb(err, null);
      }
      // access token and refresh token for them to use other google services, not needed here
    }
  )
);

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findUserByUsername } = require("../models/user");
const passport = require("passport");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserByUsername(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

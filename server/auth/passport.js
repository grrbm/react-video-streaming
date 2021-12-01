const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("../database/Schema").User,
  shortid = require("shortid"),
  bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // define the parameter in req.body that passport can use as username and password
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    const userInformation = {
      userId: user.id,
      email: user.email,
    };
    cb(err, userInformation);
  });
});

module.exports = passport;

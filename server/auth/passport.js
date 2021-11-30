const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("../database/Schema").User,
  shortid = require("shortid");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
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
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    const userInformation = {
      username: user.username,
    };
    cb(err, userInformation);
  });
});

module.exports = passport;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    // 因为 passport 默认使用 username 和 password 字段，而我们是使用 req.body 中的
    // email 与 password 做认证，所以需要用这一行来修改下默认字段。
    { usernameField: "email", passwordField: "password" },
    function(username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Incorrect username."
          });
        }
        if (user.password !== password) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        return done(null, user);
      });
    }
  )
);

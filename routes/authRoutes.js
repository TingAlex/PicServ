const passport = require("passport");
const mongoose = require("mongoose");
const fileSys = require("../utils/fileSystem");
const User = mongoose.model("users");

module.exports = app => {
  app.post("/api/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(info);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.send(user);
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    // console.log("req user is " + req.user);
    res.send(req.user);
  });

  app.get("/api/requestInfo", (req, res) => {
    console.log(req);

    res.send("");
  });

  app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("received is " + username + " " + email + " " + password);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.send({ err: "user already exist!" });
    }
    const user = new User({ userName: username, email, password });
    try {
      await user.save();
      fileSys.createUserFloder(user.id);
      res.send({ user: { userName: username, email } });
    } catch (err) {
      res.status(422).send(err);
    }
  });
};

// node 目前只支持common js模块，所以只能使用require方法引入模组
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

require("./models/User");
require("./services/passport");
const bodyParser = require("body-parser");
mongoose.connect(keys.mongoURI);
const app = express();
app.use(express.static("public"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT)